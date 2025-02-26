from flask import Flask, render_template, Response
from flask_sock import Sock
import cv2
import face_recognition
import numpy as np
import os
import json
from collections import defaultdict

app = Flask(__name__)
sock = Sock(app)

# Store WebSocket clients
clients = set()

def generate_frames():
    camera = cv2.VideoCapture(0)
    
    # Set lower resolution for faster processing
    camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Process every other frame to reduce CPU usage
    frame_count = 0
    
    if not camera.isOpened():
        print("Error: Could not open camera")
        return

    while True:
        success, frame = camera.read()
        if not success:
            print("Error: Could not read frame")
            break
            
        frame_count += 1
        if frame_count % 2 != 0:  # Process every other frame
            continue
            
        # Process frame for face recognition
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        # Find all face locations in the current frame
        face_locations = face_recognition.face_locations(rgb_small_frame, model="hog")  # Use HOG for faster processing
        
        current_matches = defaultdict(float)
        
        if face_locations:
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations, num_jitters=1)
            
            for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
                if len(known_face_encodings) > 0:
                    # Use numpy for faster distance calculation
                    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    
                    # Update matches dictionary
                    for idx, distance in enumerate(face_distances):
                        name = known_face_names[idx]
                        confidence = (1 - distance) * 100
                        current_matches[name] = max(current_matches[name], confidence)
                    
                    best_match_index = np.argmin(face_distances)
                    if face_distances[best_match_index] < 0.45:
                        name = known_face_names[best_match_index]
                        # Scale back the coordinates
                        top *= 4
                        right *= 4
                        bottom *= 4
                        left *= 4
                        
                        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
                        cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)
            
            if current_matches:
                try:
                    broadcast_matches(current_matches)
                except Exception as e:
                    print(f"Error broadcasting matches: {e}")
        
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    camera.release()

def broadcast_matches(matches):
    """Broadcast matches to all connected clients"""
    # Convert numpy float32 to Python float for JSON serialization
    matches_json = {name: float(confidence) for name, confidence in matches.items()}
    message = json.dumps({"matches": matches_json})
    
    disconnected = set()
    
    for client in clients:
        try:
            client.send(message)
        except Exception as e:
            print(f"Error sending to client: {e}")
            disconnected.add(client)
    
    for client in disconnected:
        clients.remove(client)

@sock.route('/ws')
def websocket(ws):
    clients.add(ws)
    try:
        while True:
            data = ws.receive()
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        clients.remove(ws)

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/recognition')
def index():
    known_faces = [f for f in os.listdir('static/known_faces') if f.endswith(('.jpg', '.jpeg', '.png'))]
    return render_template('index.html', known_faces=known_faces)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Load known faces on startup
    known_face_encodings = []
    known_face_names = []
    
    print("Loading known faces...")
    
    # Load known faces from the static/known_faces directory
    known_faces_dir = "static/known_faces"
    for filename in os.listdir(known_faces_dir):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            try:
                # Load the image
                image_path = os.path.join(known_faces_dir, filename)
                face_image = face_recognition.load_image_file(image_path)
                
                # Get face encoding
                face_encodings = face_recognition.face_encodings(face_image)
                if face_encodings:
                    known_face_encodings.append(face_encodings[0])
                    # Use filename without extension as the person's name
                    known_face_names.append(os.path.splitext(filename)[0])
                    print(f"Loaded face: {filename}")
                else:
                    print(f"No face found in {filename}")
            except Exception as e:
                print(f"Error loading face {filename}: {e}")
    
    print(f"Successfully loaded {len(known_face_encodings)} faces")
    
    # Run the Flask app
    app.run(debug=True, threaded=True, host='0.0.0.0', port=5000)
