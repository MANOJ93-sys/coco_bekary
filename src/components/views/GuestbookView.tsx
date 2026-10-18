import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Cookie, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  sticker: string;
  timestamp: string;
}

const SEEDED_ENTRIES: GuestbookEntry[] = [
  {
    id: 'seed-1',
    name: 'Hana from Sugarberry Lane',
    message: 'The matcha serenity cake literally cured my Monday exam anxiety! Thank you Coco!',
    sticker: '🍵',
    timestamp: '2 hours ago',
  },
  {
    id: 'seed-2',
    name: 'Chef Pierre',
    message: 'Cake Chaos is terrifyingly addictive. I scored 125 pts and I am demanding a rematch!',
    sticker: '👨‍🍳',
    timestamp: '5 hours ago',
  },
  {
    id: 'seed-3',
    name: 'Toby & Mia',
    message: 'We were completely fooled by the sculpted sneaker cake! Our mom thought it was a real shoe!!',
    sticker: '👟',
    timestamp: 'Yesterday',
  },
  {
    id: 'seed-4',
    name: 'Grandma Hazel',
    message: 'So proud of my little grand-baker. Do not forget to wipe the flour off your nose, darling!',
    sticker: '👵',
    timestamp: '2 days ago',
  },
];

const STICKERS = ['🍓', '🍰', '🧁', '🍪', '✨', '🍵', '🍒', '⭐'];

interface GuestbookViewProps {
  visitorCount: number;
}

export const GuestbookView: React.FC<GuestbookViewProps> = ({ visitorCount }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('coco_guestbook_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SEEDED_ENTRIES;
      }
    }
    return SEEDED_ENTRIES;
  });

  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('🍓');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Persist entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coco_guestbook_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = authorName.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setErrorMessage('Please tell us your baker name or nickname!');
      return;
    }
    if (cleanName.length > 30) {
      setErrorMessage('Name is too long (max 30 characters).');
      return;
    }
    if (!cleanMessage) {
      setErrorMessage('Please write a short note for the bakery!');
      return;
    }
    if (cleanMessage.length > 150) {
      setErrorMessage('Notes must be under 150 characters.');
      return;
    }

    sound.playSprinkles();

    const newEntry: GuestbookEntry = {
      id: `note-${Date.now()}`,
      name: cleanName,
      message: cleanMessage,
      sticker: selectedSticker,
      timestamp: 'Just now',
    };

    setEntries([newEntry, ...entries]);
    setAuthorName('');
    setMessage('');
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D81159] uppercase tracking-wider">
          <MessageSquare size={14} />
          <span>Local Sweet Community Board</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2314]">
          The Bakery Guestbook
        </h2>
        <p className="text-sm text-[#664635] max-w-lg mx-auto">
          Sign the guestbook with a sweet memory, recipe idea, or shoutout to Coco!
          All notes are saved in your local bakery ledger.
        </p>

        {/* Visitor Counter Stamp */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-[#FFF9F2] px-4 py-2 rounded-2xl border border-[#FDE68A] text-xs font-bold text-[#78350F] shadow-2xs">
            <Cookie size={16} className="text-[#D97706]" />
            <span>Sugarberry Lane Lifetime Visitors:</span>
            <span className="font-mono text-sm text-[#D81159] tabular-nums font-black">
              #{visitorCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Signing Form on Left, Note Wall on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="md:col-span-5 rounded-3xl bg-white border-2 border-[#FFD1DC] p-6 shadow-xs space-y-4">
          <span className="text-xs font-bold text-[#D81159] uppercase tracking-wider block">
            Leave a Note for Coco
          </span>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#664635] mb-1">
                Your Baker Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={30}
                placeholder="e.g. Vanilla Scout, Alex, Grandma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FFFDF9] text-xs text-[#3D2314] focus:outline-none focus:border-[#D81159]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#664635] mb-1">
                Pick a Confectionery Sticker
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STICKERS.map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedSticker(stk);
                    }}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                      selectedSticker === stk
                        ? 'border-[#D81159] bg-[#FFE4E9] scale-110'
                        : 'border-[#F2E5D3] bg-[#FFFDF7] hover:border-[#FFCCD5]'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#664635]">
                  Your Message
                </label>
                <span className="text-[10px] text-[#8C7A70] font-mono tabular-nums">
                  {message.length}/150
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="What did you love about Coco Crumble? Any favorite cakes?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBCE] bg-[#FFFDF9] text-xs text-[#3D2314] focus:outline-none focus:border-[#D81159] resize-none"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 font-semibold">{errorMessage}</p>
            )}

            {submitSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Your note was pinned to the bakery wall!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>Pin Note to Board</span>
            </button>
          </form>
        </div>

        {/* Note Wall */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-xs font-bold text-[#8C7A70] uppercase tracking-wider block">
            Recent Notes ({entries.length})
          </span>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white border border-[#F2E5D3] shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3.5"
              >
                <div className="text-2xl p-2 rounded-xl bg-[#FFF5F7] border border-[#FFCCD5] shrink-0">
                  {entry.sticker}
                </div>
                <div className="space-y-1 text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#3D2314] truncate">
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-[#8C7A70] shrink-0">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#664635] leading-relaxed break-words">
                    {entry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
