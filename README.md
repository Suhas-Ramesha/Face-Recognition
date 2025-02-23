# Face Recognition Tool  

## **Overview**  
This is a simple yet effective face recognition tool that identifies faces from images based on a predefined set of known faces stored in a folder. It leverages computer vision and deep learning techniques to match unknown faces against the database and provides real-time recognition results.  

##**Demo**
Check out the live demo: [Live Demo Link]

## **Features**  
- Compares unknown faces with images in the **"known_faces"** folder  
- Uses deep learning for accurate face detection and recognition  
- Simple and efficient image processing  
- Easy to configure and expand with additional known faces  

## **Installation**  
1. **Clone the repository**  
   ```bash
   git clone <repository-link>
   cd face-recognition-tool
   ```
2. Install dependencies
   ```bash
   Copy
   Edit
   pip install -r requirements.txt
   ```
3.Prepare known faces

Place images of known individuals in the known_faces folder.
Ensure each image filename corresponds to the person's name.
Run the tool

```bash
Copy
Edit
python face_recognition.py
```
##**Usage**
The tool will scan and recognize faces from input images.
If a match is found, it will display the person's name; otherwise, it will mark the face as "Unknown".
Results can be displayed visually or logged for further analysis.

##**Requirements**
Python 3.x
OpenCV
dlib
face_recognition library

##**Contributing**
Feel free to open issues or submit pull requests to improve the tool!

##License
This project is open-source and available under the MIT License.
