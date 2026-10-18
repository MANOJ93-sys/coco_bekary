import React, { useState } from 'react';
import { Eye, CheckCircle2, XCircle, RotateCcw, Sparkles, Award } from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface CakeOrFakeQuestion {
  id: number;
  title: string;
  imageSrc: string;
  isCake: boolean;
  clue: string;
  revealText: string;
  funFact: string;
}

const QUESTIONS: CakeOrFakeQuestion[] = [
  {
    id: 1,
    title: 'Retro High-Top Leather Sneaker',
    imageSrc: '/src/assets/images/cake_sculpted_sneaker_1792304276401.jpg',
    isCake: true,
    clue: 'Look closely at the stitching, the foam sole, and the heel texture...',
    revealText: 'IT IS CAKE! 🍰 That sneaker was meticulously carved out of dark chocolate sponge and red velvet buttercream!',
    funFact: 'Master illusion sculptors use edible wafer paper laces and textured modeling chocolate to replicate leather seams.',
  },
  {
    id: 2,
    title: 'Terracotta Potted Window Succulent',
    imageSrc: '/src/assets/images/real_potted_succulent_1792304276596.jpg',
    isCake: false,
    clue: 'Notice the mineral patina on the clay pot and the natural water drops on the leaves...',
    revealText: 'IT IS FAKE (Real Plant)! 🌿 You cannot eat this windowsill echeveria plant, no matter how tender the leaves look!',
    funFact: 'While many bakers sculpt fondant succulents, this one is photosynthesis-powered with genuine garden soil!',
  },
  {
    id: 3,
    title: 'Diner Double Cheeseburger with Fries',
    imageSrc: '/src/assets/images/cake_sculpted_burger_1792304277399.jpg',
    isCake: true,
    clue: 'Look at the sesame seed bun and the cut showing moist sponge layers inside...',
    revealText: 'IT IS CAKE! 🍔 The burger patty is crushed cocoa brownies, and the melted cheese is rolled yellow fondant!',
    funFact: 'The French fries on the side were baked from sliced pound cake and dusted with cinnamon sugar!',
  },
  {
    id: 4,
    title: 'Vintage 1970s Mechanical 35mm Camera',
    imageSrc: '/src/assets/images/real_vintage_camera_1792304278517.jpg',
    isCake: false,
    clue: 'Inspect the optical glass reflections in the lens and the genuine brassing patina on the corner edges...',
    revealText: 'IT IS FAKE (Real Camera)! 📷 Heavy brass, precision glass lenses, and 100% metal gears—not a crumb of flour here!',
    funFact: 'A real vintage mechanical camera weighs nearly 700 grams of steel and brass. Do not attempt to bite it!',
  },
  {
    id: 5,
    title: 'Antique Blue Floral Porcelain Teapot',
    imageSrc: '/src/assets/images/cake_sculpted_teapot_1792304295278.jpg',
    isCake: true,
    clue: 'Notice the glossy edible glaze and the slice cut out on the side revealing rich crumb...',
    revealText: 'IT IS CAKE! 🫖 Hand-painted with blue food coloring onto sugar paste, containing cinnamon carrot cake inside!',
    funFact: 'Edible luster dust and clear alcohol glaze give fondant the authentic high-gloss look of kiln-fired glazed porcelain.',
  },
  {
    id: 6,
    title: 'Yellow Rubber Bath Duck',
    imageSrc: '/src/assets/images/real_rubber_duck_1792304294657.jpg',
    isCake: false,
    clue: 'Examine the water droplet splashes and the genuine flexible vinyl surface sheen...',
    revealText: 'IT IS FAKE (Real Bath Toy)! 🦆 Floating happily in bubble bath water, made of pure squeaky non-toxic rubber!',
    funFact: 'Rubber ducks have been bathtub companions since the late 1940s. Coco says: leave this one in the tub!',
  },
];

export const CakeOrFakeGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const handleGuess = (guessIsCake: boolean) => {
    if (isRevealed) return;
    setSelectedGuess(guessIsCake);
    setIsRevealed(true);

    const isCorrect = guessIsCake === currentQ.isCake;
    if (isCorrect) {
      sound.playVictory();
      setScore((s) => s + 1);
    } else {
      sound.playOops();
    }
  };

  const handleNext = () => {
    sound.playChime(750);
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedGuess(null);
      setIsRevealed(false);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    sound.playPop();
    setCurrentIndex(0);
    setScore(0);
    setSelectedGuess(null);
    setIsRevealed(false);
    setIsGameOver(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2E5D3] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] uppercase tracking-wider">
            <Eye size={14} />
            <span>Visual Deception Challenge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
            Cake or Fake?
          </h2>
          <p className="text-xs sm:text-sm text-[#664635]">
            Is it hyper-realistic sculpted pastry art, or an everyday real object?
          </p>
        </div>

        {/* Progress & Score Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#EADBCE] px-3.5 py-1.5 rounded-2xl shadow-2xs text-xs font-bold flex items-center gap-2">
            <Award size={16} className="text-[#059669]" />
            <span>Score:</span>
            <span className="font-mono text-sm text-[#059669] tabular-nums">
              {score} / {QUESTIONS.length}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE GAME CARD */}
      {!isGameOver && (
        <div className="rounded-3xl bg-white border-2 border-[#D1F2E2] p-5 sm:p-8 shadow-xs space-y-6">
          {/* Round Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-[#664635]">
            <span>
              Round {currentIndex + 1} of {QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIndex
                      ? 'bg-[#059669] scale-125'
                      : i < currentIndex
                      ? 'bg-[#A7F3D0]'
                      : 'bg-[#E5E7EB]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Target Object Image Showcase */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#EADBCE] shadow-sm bg-[#FAF0E6] aspect-[4/3] max-w-xl mx-auto flex items-center justify-center">
            <img
              src={currentQ.imageSrc}
              alt={currentQ.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay Title */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 to-transparent p-4 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0]">
                Subject Inspection
              </span>
              <h3 className="text-lg sm:text-xl font-bold">{currentQ.title}</h3>
            </div>
          </div>

          {/* Clue Prompt */}
          <div className="text-center text-xs text-[#664635] italic max-w-md mx-auto">
            💡 {currentQ.clue}
          </div>

          {/* Guess Buttons (Active when not revealed) */}
          {!isRevealed ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
              <button
                onClick={() => handleGuess(true)}
                className="py-4 px-6 rounded-2xl bg-[#FFE4E9] hover:bg-[#FFD1DC] text-[#D81159] border-2 border-[#FFCCD5] font-extrabold text-base shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex flex-col items-center gap-1"
              >
                <span className="text-2xl">🍰</span>
                <span>It&#39;s Cake!</span>
              </button>

              <button
                onClick={() => handleGuess(false)}
                className="py-4 px-6 rounded-2xl bg-[#E6F8F0] hover:bg-[#D1F2E2] text-[#059669] border-2 border-[#A7F3D0] font-extrabold text-base shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex flex-col items-center gap-1"
              >
                <span className="text-2xl">🔍</span>
                <span>It&#39;s Fake! (Real)</span>
              </button>
            </div>
          ) : (
            /* Reveal Feedback Banner */
            <div className="space-y-4 max-w-xl mx-auto pt-2">
              <div
                className={`p-5 rounded-2xl border-2 flex items-start gap-4 ${
                  selectedGuess === currentQ.isCake
                    ? 'bg-[#E6F8F0] border-[#059669] text-[#065F46]'
                    : 'bg-[#FFF1F2] border-[#E11D48] text-[#9F1239]'
                }`}
              >
                <div className="text-3xl shrink-0 mt-0.5">
                  {selectedGuess === currentQ.isCake ? (
                    <CheckCircle2 size={32} className="text-[#059669]" />
                  ) : (
                    <XCircle size={32} className="text-[#E11D48]" />
                  )}
                </div>

                <div className="space-y-1 text-left text-xs sm:text-sm">
                  <span className="font-extrabold uppercase tracking-wide block">
                    {selectedGuess === currentQ.isCake ? '🎯 Correct Guess!' : '❌ Fooled by the Illusion!'}
                  </span>
                  <p className="font-semibold">{currentQ.revealText}</p>
                  <p className="text-xs opacity-90 pt-1 italic">{currentQ.funFact}</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex + 1 < QUESTIONS.length ? 'Next Mystery Object →' : 'See Final Results →'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER RESULTS SCREEN */}
      {isGameOver && (
        <div className="rounded-3xl bg-white border-2 border-[#D1F2E2] p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#E6F8F0] text-[#059669] flex items-center justify-center text-4xl shadow-inner font-black">
            {score >= 5 ? '🏆' : score >= 3 ? '🍰' : '🔍'}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              {score >= 5
                ? 'Sharp-Eyed Detective!'
                : score >= 3
                ? 'Confectionery Connoisseur'
                : 'Tricked by the Frosting!'}
            </span>
            <h3 className="text-3xl font-black text-[#3D2314]">
              {score} out of {QUESTIONS.length} Correct!
            </h3>
            <p className="text-xs sm:text-sm text-[#664635] max-w-md mx-auto">
              {score >= 5
                ? "Incredible observation! You could spot a fondant stitch from fifty paces away!"
                : score >= 3
                ? "Great eye! A few illusions got the best of you, but Coco is impressed."
                : "Those cake artists are sneaky masters of deception! Ready to test your eyes again?"}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw size={16} />
              <span>Play Cake or Fake Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
