import React, { useState } from 'react';
import { LoveStoryConfig } from '../types/game';
import { Settings, Save, RotateCcw, Heart, Plus, Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MemoryEditorModalProps {
  config: LoveStoryConfig;
  onSave: (newConfig: LoveStoryConfig) => void;
  onReset: () => void;
  onClose: () => void;
}

export const MemoryEditorModal: React.FC<MemoryEditorModalProps> = ({
  config,
  onSave,
  onReset,
  onClose
}) => {
  const [formData, setFormData] = useState<LoveStoryConfig>({ ...config });
  const [letterParagraphs, setLetterParagraphs] = useState<string>(
    config.loveLetterBody.join('\n\n')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCollectSound();
    const updated: LoveStoryConfig = {
      ...formData,
      loveLetterBody: letterParagraphs
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean)
    };
    onSave(updated);
    onClose();
  };

  const handleAddPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
          caption: 'Our special moment together',
          date: 'Our Date'
        }
      ]
    }));
  };

  const handleRemovePhoto = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-amber-600 rounded-none p-5 text-slate-100 shadow-[8px_8px_0_0_#0f172a] font-vt text-lg max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-pixel text-xs sm:text-sm text-amber-300 tracking-wider">
              CUSTOMIZE OUR LOVE QUEST & LETTER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-500 text-xs font-pixel"
          >
            ✕
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-3 bg-slate-950 border-2 border-slate-800 text-xs text-amber-200/90 font-pixel leading-normal">
            ✨ Tip: Personalize your boyfriend’s name, anniversary date, and custom love letter so when he unlocks the secret quest it speaks straight from your heart!
          </div>

          {/* Names & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-pixel text-xs text-rose-300 mb-1">
                Boyfriend's Name:
              </label>
              <input
                type="text"
                value={formData.boyfriendName}
                onChange={e => setFormData({ ...formData, boyfriendName: e.target.value })}
                className="w-full bg-slate-950 border-2 border-slate-700 p-2 text-slate-100 font-vt text-lg focus:border-rose-500 focus:outline-none"
                placeholder="e.g. Alex"
                required
              />
            </div>
            <div>
              <label className="block font-pixel text-xs text-rose-300 mb-1">
                Your Name:
              </label>
              <input
                type="text"
                value={formData.girlfriendName}
                onChange={e => setFormData({ ...formData, girlfriendName: e.target.value })}
                className="w-full bg-slate-950 border-2 border-slate-700 p-2 text-slate-100 font-vt text-lg focus:border-rose-500 focus:outline-none"
                placeholder="e.g. Vanessa"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-pixel text-xs text-amber-300 mb-1">
              Anniversary / Special Date:
            </label>
            <input
              type="text"
              value={formData.anniversaryDate}
              onChange={e => setFormData({ ...formData, anniversaryDate: e.target.value })}
              className="w-full bg-slate-950 border-2 border-slate-700 p-2 text-slate-100 font-vt text-lg focus:border-amber-500 focus:outline-none"
              placeholder="e.g. October 14, 2023 · 3 Years Together"
            />
          </div>

          {/* Love Letter Body */}
          <div>
            <label className="block font-pixel text-xs text-rose-300 mb-1">
              The Secret Love Letter (paragraphs separated by blank lines):
            </label>
            <textarea
              rows={6}
              value={letterParagraphs}
              onChange={e => setLetterParagraphs(e.target.value)}
              className="w-full bg-slate-950 border-2 border-slate-700 p-2 text-slate-100 font-vt text-lg focus:border-rose-500 focus:outline-none"
              placeholder="Write your heartfelt message here..."
            />
          </div>

          <div>
            <label className="block font-pixel text-xs text-rose-300 mb-1">
              Signoff Line:
            </label>
            <input
              type="text"
              value={formData.loveLetterSignoff}
              onChange={e => setFormData({ ...formData, loveLetterSignoff: e.target.value })}
              className="w-full bg-slate-950 border-2 border-slate-700 p-2 text-slate-100 font-vt text-lg focus:border-rose-500 focus:outline-none"
              placeholder="With all my love forever and ever,"
            />
          </div>

          {/* Photos */}
          <div className="pt-2 border-t-2 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-xs text-sky-300">POLAROID PHOTOS</span>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="flex items-center gap-1 px-2 py-1 bg-sky-900 border border-sky-600 font-pixel text-[10px] text-sky-200 hover:bg-sky-800"
              >
                <Plus className="w-3 h-3" /> Add Photo
              </button>
            </div>

            <div className="space-y-3">
              {formData.photos.map((p, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[10px] text-slate-400">Photo #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={p.url}
                    onChange={e => {
                      const next = [...formData.photos];
                      next[idx].url = e.target.value;
                      setFormData({ ...formData, photos: next });
                    }}
                    placeholder="Image URL"
                    className="w-full bg-slate-900 border border-slate-700 p-1.5 text-xs font-mono text-slate-200"
                  />
                  <input
                    type="text"
                    value={p.caption}
                    onChange={e => {
                      const next = [...formData.photos];
                      next[idx].caption = e.target.value;
                      setFormData({ ...formData, photos: next });
                    }}
                    placeholder="Caption (e.g. Our night at the beach)"
                    className="w-full bg-slate-900 border border-slate-700 p-1.5 text-sm font-vt text-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset to default romantic preset?')) {
                  onReset();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 font-pixel text-xs text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 border-2 border-amber-300 font-pixel text-xs cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Memories
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
