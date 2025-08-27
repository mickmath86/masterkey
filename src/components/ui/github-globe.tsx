"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GithubGlobeProps {
  className?: string;
}

export function GithubGlobe({ className = "" }: GithubGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    let animationId: number;
    let rotation = 0;

    const drawGlobe = () => {
      ctx.clearRect(0, 0, size, size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = 80;

      // Draw globe background
      const gradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#4f46e5');
      gradient.addColorStop(0.7, '#3730a3');
      gradient.addColorStop(1, '#1e1b4b');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;

      // Longitude lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + rotation;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX - Math.cos(angle) * radius;
        const y2 = centerY - Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Latitude lines
      for (let i = 1; i < 4; i++) {
        const y = centerY + (radius * (i - 2)) / 2;
        const width = Math.sqrt(radius * radius - Math.pow((y - centerY), 2)) * 2;
        
        ctx.beginPath();
        ctx.ellipse(centerX, y, width / 2, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw pulsing dots (representing data points)
      const dots = [
        { x: 0.3, y: 0.2, phase: 0 },
        { x: -0.4, y: 0.1, phase: Math.PI / 2 },
        { x: 0.2, y: -0.3, phase: Math.PI },
        { x: -0.1, y: 0.4, phase: 3 * Math.PI / 2 },
      ];

      dots.forEach((dot, index) => {
        const x = centerX + dot.x * radius;
        const y = centerY + dot.y * radius;
        const pulse = Math.sin(rotation * 2 + dot.phase) * 0.5 + 0.5;
        const dotRadius = 3 + pulse * 2;
        
        ctx.fillStyle = `rgba(34, 197, 94, ${0.6 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rotation += 0.01;
      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 0 20px rgba(79, 70, 229, 0.3))' }}
      />
    </motion.div>
  );
}
