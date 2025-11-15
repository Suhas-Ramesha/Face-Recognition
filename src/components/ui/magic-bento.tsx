import React, { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagicBentoProps {
  children: ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  className?: string;
  disabled?: boolean;
}

const MagicBento: React.FC<MagicBentoProps> = ({
  children,
  textAutoHide = false,
  enableStars = false,
  enableSpotlight = false,
  enableBorderGlow = false,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = false,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = "132, 0, 255",
  className = "",
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Position relative to container (for spotlight)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePosition({
      x: mouseX,
      y: mouseY
    });

    if ((enableTilt || enableMagnetism) && !disabled) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normalizedX = (mouseX - centerX) / centerX;
      const normalizedY = (mouseY - centerY) / centerY;
      x.set(normalizedX);
      y.set(normalizedY);
    }
  }, [enableTilt, enableMagnetism, x, y, disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!disabled) {
      x.set(0);
      y.set(0);
    }
  }, [x, y, disabled]);

  // Disable all effects if disabled prop is true
  const isDisabled = disabled;
  const effectiveEnableStars = !isDisabled && enableStars;
  const effectiveEnableSpotlight = !isDisabled && enableSpotlight;
  const effectiveEnableBorderGlow = !isDisabled && enableBorderGlow;
  const effectiveEnableTilt = !isDisabled && enableTilt;
  const effectiveEnableMagnetism = !isDisabled && enableMagnetism;
  const effectiveClickEffect = !isDisabled && clickEffect;
  const effectiveTextAutoHide = !isDisabled && textAutoHide;

  const handleClick = useCallback(() => {
    if (effectiveClickEffect && !disabled) {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    }
  }, [effectiveClickEffect, disabled]);

  useEffect(() => {
    if (effectiveEnableStars && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      }));
      setParticles(newParticles);
    }
  }, [effectiveEnableStars, particleCount]);

  useEffect(() => {
    if (effectiveEnableStars && particles.length > 0 && containerRef.current) {
      const interval = setInterval(() => {
        setParticles(prev => prev.map(p => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return p;
          
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;

          if (newX < 0 || newX > rect.width) p.vx *= -1;
          if (newY < 0 || newY > rect.height) p.vy *= -1;

          return {
            ...p,
            x: Math.max(0, Math.min(rect.width, newX)),
            y: Math.max(0, Math.min(rect.height, newY))
          };
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [effectiveEnableStars, particles]);

  // Clear particles and reset state when disabled
  useEffect(() => {
    if (disabled) {
      setParticles([]);
      setIsHovered(false);
      setClicked(false);
      x.set(0);
      y.set(0);
    } else if (enableStars && !particles.length && containerRef.current) {
      // Reinitialize particles when re-enabled
      const rect = containerRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      }));
      setParticles(newParticles);
    }
  }, [disabled, x, y, enableStars, particleCount, particles.length]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={disabled ? undefined : handleMouseMove}
      onMouseEnter={disabled ? undefined : () => setIsHovered(true)}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
      onClick={disabled ? undefined : handleClick}
      style={{
        rotateX: effectiveEnableTilt ? rotateX : 0,
        rotateY: effectiveEnableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        scale: clicked && !isDisabled ? 0.98 : 1,
        transition: clicked && !isDisabled ? 'scale 0.1s' : undefined
      }}
    >
      {/* Border Glow */}
      {effectiveEnableBorderGlow && isHovered && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `0 0 ${spotlightRadius}px rgba(${glowColor}, 0.5)`,
            transition: 'box-shadow 0.3s ease'
          }}
        />
      )}

      {/* Spotlight Effect */}
      {effectiveEnableSpotlight && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.3), transparent 70%)`,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Stars/Particles */}
      {effectiveEnableStars && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            background: `rgba(${glowColor}, 0.6)`,
            boxShadow: `0 0 4px rgba(${glowColor}, 0.8)`,
            transition: 'all 0.05s linear'
          }}
        />
      ))}

      {/* Content */}
      <div className={effectiveTextAutoHide && !isHovered ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>

      {/* Click Ripple Effect */}
      {effectiveClickEffect && clicked && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: 0,
            height: 0,
            background: `radial-gradient(circle, rgba(${glowColor}, 0.4), transparent)`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            width: spotlightRadius * 2,
            height: spotlightRadius * 2,
            opacity: [0.6, 0]
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
};

export default MagicBento;

