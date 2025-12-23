"use client";

import { useRef } from "react";

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function LiquidCard({ children, className = "", style, onClick }: LiquidCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable mouse tracking on Safari to prevent memory issues
    if (isSafari || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`liquid-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

