import React from 'react';

interface TopicCardProps {
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
  colorClass: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({ title, icon, description, onClick, colorClass }) => {
  return (
    <button 
      onClick={onClick}
      className={`text-left group relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl glass-panel ${colorClass}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-6xl">{icon}</span>
      </div>
      <div className="relative z-10">
        <span className="text-3xl mb-4 block">{icon}</span>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </button>
  );
};