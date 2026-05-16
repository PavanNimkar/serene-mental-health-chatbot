// src/components/GlassCard.jsx
export default function GlassCard({ children, className = "", hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl ${hover ? "hover:scale-[1.01] hover:shadow-md transition-all duration-200 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
