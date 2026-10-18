import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/soundEngine';

interface CocoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  speechText?: string;
  onClipClick?: () => void;
  isGoldenMode?: boolean;
  className?: string;
}

export const CocoMascot: React.FC<CocoMascotProps> = ({
  size = 'md',
  speechText,
  onClipClick,
  isGoldenMode = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'delighted' | 'surprised' | 'winking'>('happy');
  const [currentSpeech, setCurrentSpeech] = useState<string>(speechText || "Life is short. Add extra frosting!");
  const [showSpeech, setShowSpeech] = useState(true);

  // Synchronize external speech updates
  useEffect(() => {
    if (speechText) {
      setCurrentSpeech(speechText);
      setShowSpeech(true);
    }
  }, [speechText]);

  // Natural blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800 + Math.random() * 1500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Eye cursor tracking (with natural radius clamping)
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35; // Head center

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 350);
      const maxOffset = 4.5; // Natural subtle range in pixels

      const normalizedDist = (distance / 350) * maxOffset;
      setPupilOffset({
        x: Math.cos(angle) * normalizedDist,
        y: Math.sin(angle) * normalizedDist,
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Friendly tap/click reaction
  const handleMascotClick = () => {
    sound.playPop();
    const expressions: Array<'happy' | 'delighted' | 'surprised' | 'winking'> = [
      'delighted',
      'surprised',
      'winking',
      'happy',
    ];
    const quotes = [
      "Life is short. Add extra frosting!",
      "My whisk never rests when cake is on the line!",
      "A pinch of sugar and a mountain of love!",
      "You've got that master baker spark in your eyes!",
      "Grandma's recipe book says: every feeling has a flavor!",
      "Careful with the strawberry clips—they're my lucky charm!",
    ];

    const nextExp = expressions[Math.floor(Math.random() * expressions.length)];
    const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];

    setExpression(nextExp);
    setCurrentSpeech(nextQuote);
    setShowSpeech(true);

    setTimeout(() => {
      setExpression('happy');
    }, 2400);
  };

  const handleClipTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSprinkles();
    if (onClipClick) {
      onClipClick();
    }
  };

  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-44 h-52',
    lg: 'w-64 h-76',
    hero: 'w-72 h-84 md:w-88 md:h-100',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onClick={handleMascotClick}
      role="region"
      aria-label="Coco the Baker Mascot"
    >
      {/* Contextual Speech Bubble */}
      {showSpeech && (
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-white text-[#3D2314] px-4 py-2 rounded-2xl shadow-md border-2 border-[#FFE4E9] text-xs md:text-sm font-semibold tracking-wide animate-gentle-float flex items-center gap-1.5"
          role="status"
        >
          <span>🍓</span>
          <span>{currentSpeech}</span>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </div>
      )}

      {/* SVG Character Rig */}
      <svg
        viewBox="0 0 200 240"
        className={`${sizeClasses} cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-95 drop-shadow-sm`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B4226" />
            <stop offset="50%" stopColor="#543118" />
            <stop offset="100%" stopColor="#3E200C" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2E8" />
            <stop offset="100%" stopColor="#FFE4D4" />
          </linearGradient>

          {/* Dress Pink Gradient */}
          <linearGradient id="dressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8BA7" />
            <stop offset="100%" stopColor="#E65D7B" />
          </linearGradient>

          {/* Apron Cream Gradient */}
          <linearGradient id="apronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFC" />
            <stop offset="100%" stopColor="#F7F1E5" />
          </linearGradient>

          {/* Golden Crown Gradient for Easter Egg */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDF00" />
            <stop offset="50%" stopColor="#FFB703" />
            <stop offset="100%" stopColor="#FB8500" />
          </linearGradient>
        </defs>

        {/* Back Hair (Bob cut) */}
        <path
          d="M 50 85 C 38 120 40 160 55 175 C 65 185 85 190 100 190 C 115 190 135 185 145 175 C 160 160 162 120 150 85 Z"
          fill="url(#hairGrad)"
        />

        {/* Body & Pink Dress */}
        <g id="body">
          {/* Dress Skirt */}
          <path
            d="M 68 150 L 52 225 C 75 233 125 233 148 225 L 132 150 Z"
            fill="url(#dressGrad)"
          />
          {/* Puffy Sleeves */}
          <circle cx="68" cy="155" r="14" fill="#FF8BA7" />
          <circle cx="132" cy="155" r="14" fill="#FF8BA7" />

          {/* Arms */}
          <path d="M 68 160 Q 60 185 64 200" stroke="#FFE4D4" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 132 160 Q 146 180 144 195" stroke="#FFE4D4" strokeWidth="8" strokeLinecap="round" fill="none" />

          {/* Baker's Cream Apron */}
          <path
            d="M 76 148 L 72 220 C 85 225 115 225 128 220 L 124 148 Z"
            fill="url(#apronGrad)"
            stroke="#EADEC9"
            strokeWidth="1.5"
          />
          {/* Apron Straps */}
          <path d="M 78 148 L 84 135" stroke="#F7F1E5" strokeWidth="4" strokeLinecap="round" />
          <path d="M 122 148 L 116 135" stroke="#F7F1E5" strokeWidth="4" strokeLinecap="round" />

          {/* Apron Pocket with Tiny Embroidered Strawberry */}
          <rect x="88" y="180" width="24" height="18" rx="3" fill="#FFF2DF" stroke="#E5D7BE" strokeWidth="1" />
          <path d="M 100 186 C 98 184 96 187 100 192 C 104 187 102 184 100 186 Z" fill="#E63946" />

          {/* Signature Prop: Whisk in Right Hand */}
          <g id="whisk" transform="translate(144, 190) rotate(15)">
            {/* Whisk Handle */}
            <rect x="-3" y="0" width="6" height="18" rx="2" fill="#D4A373" stroke="#9C6644" strokeWidth="0.8" />
            {/* Wire Loops */}
            <path d="M 0 0 C -12 -18 12 -18 0 0" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
            <path d="M 0 0 C -8 -22 8 -22 0 0" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
            <path d="M 0 0 C -4 -25 4 -25 0 0" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
            <circle cx="0" cy="-22" r="1.5" fill="#CBD5E1" />
          </g>
        </g>

        {/* Head & Face */}
        <g id="head">
          {/* Neck */}
          <rect x="94" y="128" width="12" height="15" fill="#FFE4D4" rx="2" />

          {/* Face Oval */}
          <ellipse cx="100" cy="98" rx="42" ry="38" fill="url(#skinGrad)" />

          {/* Ears */}
          <ellipse cx="58" cy="98" rx="6" ry="8" fill="#FFE4D4" />
          <ellipse cx="142" cy="98" rx="6" ry="8" fill="#FFE4D4" />

          {/* Cute Strawberry Hair Clips (Interactive Easter Egg Trigger!) */}
          <g
            id="strawberryClips"
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={handleClipTap}
            aria-label="Coco's Strawberry Hair Clips (Secret)"
          >
            {/* Left Clip */}
            <path
              d="M 64 68 C 60 62 55 68 62 76 C 68 68 66 62 64 68 Z"
              fill="#E63946"
            />
            {/* Clip Leaf */}
            <path d="M 61 65 C 63 62 65 62 67 65" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" />
            {/* Yellow seed dots */}
            <circle cx="61" cy="70" r="0.6" fill="#FFE3A8" />
            <circle cx="64" cy="72" r="0.6" fill="#FFE3A8" />
            <circle cx="63" cy="68" r="0.6" fill="#FFE3A8" />

            {/* Right Clip */}
            <path
              d="M 136 68 C 132 62 127 68 134 76 C 140 68 138 62 136 68 Z"
              fill="#E63946"
            />
            <path d="M 133 65 C 135 62 137 62 139 65" stroke="#2A9D8F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="133" cy="70" r="0.6" fill="#FFE3A8" />
            <circle cx="136" cy="72" r="0.6" fill="#FFE3A8" />
          </g>

          {/* Soft Cheeks Blush */}
          <ellipse cx="73" cy="108" rx="9" ry="5" fill="#FF8BA7" opacity="0.45" />
          <ellipse cx="127" cy="108" rx="9" ry="5" fill="#FF8BA7" opacity="0.45" />

          {/* Small Flour Smudge on Nose (Signature detail!) */}
          <ellipse cx="100" cy="103" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.85" />
          <path d="M 99 101 Q 100 102 101 101" stroke="#DDA15E" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Large Anime Sparkling Brown Eyes */}
          {isBlinking || expression === 'winking' ? (
            // Blinking / Winking Eyelids
            <g id="blinkingEyes">
              {/* Left Eye */}
              <path d="M 74 97 Q 84 103 92 97" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Right Eye (winks if winking) */}
              {expression === 'winking' ? (
                <path d="M 108 97 Q 116 90 126 97" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M 108 97 Q 116 103 126 97" stroke="#4A2810" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}
            </g>
          ) : (
            // Open Tracking Eyes
            <g id="openEyes">
              {/* Left Eye White */}
              <ellipse cx="83" cy="96" rx="9" ry="12" fill="#FFFFFF" />
              {/* Left Iris & Pupil with Cursor Tracking Offset */}
              <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                <ellipse cx="83" cy="96" rx="6.5" ry="9" fill="#542E13" />
                <ellipse cx="83" cy="96" rx="4" ry="6" fill="#2B1607" />
                {/* Big anime sparkle highlights */}
                <circle cx="81.5" cy="92.5" r="2.8" fill="#FFFFFF" />
                <circle cx="85.5" cy="98.5" r="1.4" fill="#FFFFFF" />
                <circle cx="81" cy="99" r="0.8" fill="#FFCCD5" />
              </g>
              {/* Left Upper Eyelash & Brow */}
              <path d="M 73 91 Q 83 83 93 91" stroke="#3E200C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 75 83 Q 83 79 91 84" stroke="#543118" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Right Eye White */}
              <ellipse cx="117" cy="96" rx="9" ry="12" fill="#FFFFFF" />
              {/* Right Iris & Pupil */}
              <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                <ellipse cx="117" cy="96" rx="6.5" ry="9" fill="#542E13" />
                <ellipse cx="117" cy="96" rx="4" ry="6" fill="#2B1607" />
                {/* Sparkle highlights */}
                <circle cx="115.5" cy="92.5" r="2.8" fill="#FFFFFF" />
                <circle cx="119.5" cy="98.5" r="1.4" fill="#FFFFFF" />
                <circle cx="115" cy="99" r="0.8" fill="#FFCCD5" />
              </g>
              {/* Right Upper Eyelash & Brow */}
              <path d="M 107 91 Q 117 83 127 91" stroke="#3E200C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 109 84 Q 117 79 125 83" stroke="#543118" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Mouth Expressions */}
          {expression === 'surprised' ? (
            <ellipse cx="100" cy="116" rx="4" ry="6" fill="#800E2B" />
          ) : expression === 'delighted' ? (
            <path
              d="M 94 113 Q 100 123 106 113 Z"
              fill="#D81159"
              stroke="#800E2B"
              strokeWidth="1"
            />
          ) : (
            // Happy gentle smile
            <path
              d="M 94 113 Q 100 119 106 113"
              stroke="#800E2B"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Front Hair Bangs (Bob Cut with cute framing strands) */}
          <path
            d="M 58 84 C 62 62 82 52 100 52 C 118 52 138 62 142 84 C 135 76 122 72 110 76 C 104 74 96 74 90 76 C 78 72 65 76 58 84 Z"
            fill="url(#hairGrad)"
          />
          {/* Side Bob Strands framing the cute face */}
          <path d="M 58 84 C 54 105 57 125 64 135 C 62 120 62 100 66 86 Z" fill="url(#hairGrad)" />
          <path d="M 142 84 C 146 105 143 125 136 135 C 138 120 138 100 134 86 Z" fill="url(#hairGrad)" />
        </g>

        {/* Golden Baker Hat / Easter Egg Crown Mode */}
        {isGoldenMode && (
          <g id="goldenCrown" transform="translate(100, 48) scale(0.9) translate(-100, -48)">
            {/* Fluffy Baker Toque with Golden Trim */}
            <path
              d="M 75 52 C 60 40 70 20 85 24 C 92 10 108 10 115 24 C 130 20 140 40 125 52 Z"
              fill="url(#goldGrad)"
              stroke="#B7791F"
              strokeWidth="2"
            />
            {/* Sparkle Gems */}
            <circle cx="85" cy="46" r="2.5" fill="#FFF275" />
            <circle cx="100" cy="43" r="3" fill="#FFF275" />
            <circle cx="115" cy="46" r="2.5" fill="#FFF275" />
          </g>
        )}
      </svg>
    </div>
  );
};
