"use client";

interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function LiquidCard({ children, className = "", style, onClick }: LiquidCardProps) {
  return (
    <div
      onClick={onClick}
      className={`liquid-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

