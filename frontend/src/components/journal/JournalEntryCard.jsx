// src/components/journal/JournalEntryCard.jsx
import GlassCard from "../GlassCard";

export default function JournalEntryCard({ entry, categoryColors, onClick, onDelete }) {
  const cat = entry.prompt_text ? "general" : "general";
  const colors = categoryColors[cat] || categoryColors.general;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <GlassCard
      hover
      onClick={onClick}
      className="p-5 cursor-pointer group relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#1F2933] text-sm truncate">
            {entry.title || "Untitled Entry"}
          </h4>
          <p className="text-[11px] text-[#9AA5B1] font-mono mt-0.5">
            {new Date(entry.created_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-[#9AA5B1] hover:text-red-400 ml-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>

      {/* Prompt */}
      {entry.prompt_text && (
        <p className="text-xs text-[#9AA5B1] italic mb-2 line-clamp-1">
          "{entry.prompt_text}"
        </p>
      )}

      {/* Content preview */}
      <p className="text-sm text-[#52606D] line-clamp-3 leading-relaxed mb-3">
        {entry.content}
      </p>

      {/* AI Reflection */}
      {entry.ai_reflection && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#E8F8FC] border border-[#D4EEF7] mb-3">
          <span className="material-symbols-outlined text-[14px] text-[#22B1D4] mt-0.5 shrink-0">auto_awesome</span>
          <p className="text-[11px] text-[#22B1D4] leading-relaxed">{entry.ai_reflection}</p>
        </div>
      )}

      {/* Tags */}
      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-[#E8F8FC] text-[#22B1D4] text-[10px] font-mono border border-[#D4EEF7]"
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 4 && (
            <span className="px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#9AA5B1] text-[10px] font-mono">
              +{entry.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
}
