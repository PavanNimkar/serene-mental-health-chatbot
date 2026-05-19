// src/components/journal/JournalEditor.jsx
import { useState, useEffect } from "react";
import GlassCard from "../GlassCard";
import { journal } from "../../services/api";

const CATEGORIES = [
  { value: "gratitude", label: "Gratitude", icon: "favorite" },
  { value: "reflection", label: "Reflection", icon: "self_improvement" },
  { value: "anxiety", label: "Anxiety", icon: "air" },
  { value: "goals", label: "Goals", icon: "flag" },
  { value: "self_care", label: "Self-Care", icon: "spa" },
  { value: "relationships", label: "Relationships", icon: "group" },
  { value: "general", label: "General", icon: "edit_note" },
];

export default function JournalEditor({ entry, onSaved, onCancel, onDelete }) {
  const isEdit = !!entry;

  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [tags, setTags] = useState((entry?.tags || []).join(", "));
  const [promptId, setPromptId] = useState(entry?.prompt || null);
  const [randomPrompt, setRandomPrompt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  useEffect(() => {
    if (!isEdit) fetchRandomPrompt();
  }, [isEdit]);

  const fetchRandomPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const p = await journal.randomPrompt();
      if (p?.id) setRandomPrompt(p);
    } catch (_) {}
    setLoadingPrompt(false);
  };

  const usePrompt = () => {
    if (randomPrompt) {
      setPromptId(randomPrompt.id);
      setContent((prev) => (prev ? prev : ""));
    }
  };

  const skipPrompt = () => {
    setRandomPrompt(null);
    setPromptId(null);
  };

  const handleSave = async () => {
    if (content.trim().length < 10) {
      setError("Entry must be at least 10 characters.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/\s+/g, "_"))
        .filter(Boolean);

      const payload = { title, content, tags: parsedTags };
      if (promptId) payload.prompt = promptId;

      if (isEdit) {
        await journal.update(entry.id, payload);
      } else {
        await journal.create(payload);
      }
      onSaved();
    } catch (e) {
      setError(e?.content?.[0] || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-[#52606D] hover:text-[#22B1D4] transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <div className="flex gap-2">
          {isEdit && onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 border border-red-100 transition"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-[0_4px_12px_rgba(34,177,212,.3)] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                {isEdit ? "Update" : "Save Entry"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prompt suggestion (new entry only) */}
      {!isEdit && randomPrompt && (
        <GlassCard className="p-4 border border-[#D4EEF7] bg-[#E8F8FC]/60">
          <div className="flex items-start gap-3">
            <span className="p-1.5 rounded-lg bg-white/80 border border-[#D4EEF7] shrink-0">
              <span className="material-symbols-outlined text-[18px] text-[#22B1D4]">auto_awesome</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-1">
                Today's Prompt · {randomPrompt.category}
              </p>
              <p className="text-sm text-[#1F2933] font-medium leading-relaxed">{randomPrompt.text}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={usePrompt}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#22B1D4] text-white font-medium hover:opacity-90 transition"
              >
                Use
              </button>
              <button
                onClick={skipPrompt}
                className="text-xs px-3 py-1.5 rounded-lg text-[#9AA5B1] hover:bg-white/80 transition"
              >
                Skip
              </button>
            </div>
          </div>
          {promptId === randomPrompt.id && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Prompt selected — write your response below
            </div>
          )}
        </GlassCard>
      )}

      {/* Editor card */}
      <GlassCard className="p-6 space-y-4">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title (optional)"
          className="w-full text-xl font-bold text-[#1F2933] bg-transparent placeholder-[#C5CDD5] focus:outline-none border-b border-[#E4EEF3] pb-3"
          style={{ fontFamily: "serif" }}
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            promptId && randomPrompt
              ? `Responding to: "${randomPrompt.text}"\n\nStart writing here…`
              : "What's on your mind today? Write freely…"
          }
          rows={12}
          className="w-full text-sm text-[#1F2933] bg-transparent placeholder-[#C5CDD5] focus:outline-none resize-none leading-relaxed"
        />

        {/* Footer: tags + word count */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center pt-3 border-t border-[#E4EEF3]">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-[16px]">label</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated): anxiety, work, gratitude"
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-[#E4EEF3] text-sm text-[#52606D] placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition"
            />
          </div>
          <p className="text-xs text-[#9AA5B1] font-mono shrink-0">
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </GlassCard>

      {/* View: AI reflection if editing */}
      {isEdit && entry?.ai_reflection && (
        <GlassCard className="p-4 bg-[#E8F8FC]/60 border border-[#D4EEF7]">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#22B1D4] mt-0.5 shrink-0">psychology</span>
            <div>
              <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-widest mb-1">AI Reflection</p>
              <p className="text-sm text-[#22B1D4] leading-relaxed">{entry.ai_reflection}</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
