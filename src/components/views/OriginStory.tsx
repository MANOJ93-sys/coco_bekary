import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, BookOpen, Heart, Eye, Check } from 'lucide-react';
import { sound } from '../../services/soundEngine';
import { NavTab } from '../navigation/TopNav';

interface OriginStoryProps {
  onEnterBakery: () => void;
  onNavigateToActivity: (tab: NavTab) => void;
}

export const OriginStory: React.FC<OriginStoryProps> = ({
  onEnterBakery,
  onNavigateToActivity,
}) => {
  const [currentScene, setCurrentScene] = useState<number>(1);

  // Scene 1 Interaction: discovered facts by clicking floating items
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([]);

  // Scene 2 Interaction: Grandma's book opened
  const [isBookOpened, setIsBookOpened] = useState(false);

  // Scene 3 Interaction: Frosting explosion triggered
  const [hasExploded, setHasExploded] = useState(false);

  // Scene 4 Interaction: Mood chosen in story
  const [selectedStoryMood, setSelectedStoryMood] = useState<string | null>(null);

  // Scene 5 Interaction: Quick preview guess
  const [storyGuess, setStoryGuess] = useState<'cake' | 'fake' | null>(null);

  const totalScenes = 6;

  const handleNext = () => {
    sound.playPop();
    if (currentScene < totalScenes) {
      setCurrentScene((s) => s + 1);
    }
  };

  const handleBack = () => {
    sound.playPop();
    if (currentScene > 1) {
      setCurrentScene((s) => s - 1);
    }
  };

  const handleRestart = () => {
    sound.playChime();
    setCurrentScene(1);
    setDiscoveredFacts([]);
    setIsBookOpened(false);
    setHasExploded(false);
    setSelectedStoryMood(null);
    setStoryGuess(null);
  };

  const unlockFact = (factId: string, text: string) => {
    sound.playSprinkles();
    if (!discoveredFacts.includes(factId)) {
      setDiscoveredFacts((prev) => [...prev, factId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header & Progress Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2E5D3] pb-4">
        <div>
          <span className="text-xs font-bold text-[#D81159] uppercase tracking-wider block">
            Official Character Storybook
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
            The Little Baker Who Baked Happiness
          </h2>
        </div>

        {/* Progress Stepper & Skip Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-[#EADBCE] px-3 py-1.5 rounded-2xl shadow-2xs">
            {Array.from({ length: totalScenes }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sound.playPop();
                  setCurrentScene(i + 1);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentScene === i + 1
                    ? 'bg-[#D81159] scale-125'
                    : currentScene > i + 1
                    ? 'bg-[#FFCCD5]'
                    : 'bg-[#E5D7BE]'
                }`}
                title={`Jump to Scene ${i + 1}`}
              />
            ))}
            <span className="text-xs font-bold text-[#8C7A70] ml-1 tabular-nums">
              {currentScene} / {totalScenes}
            </span>
          </div>

          <button
            onClick={onEnterBakery}
            className="text-xs font-bold text-[#8C7A70] hover:text-[#D81159] px-2 py-1 transition-colors"
          >
            Skip Story ➔
          </button>
        </div>
      </div>

      {/* STORY STAGE CONTAINER */}
      <div className="rounded-3xl bg-white border-2 border-[#FFD1DC] p-6 sm:p-10 shadow-sm relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* ================= SCENE 1 ================= */}
        {currentScene === 1 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE4E9] text-[#D81159] text-xs font-bold">
              <span>🍓</span>
              <span>Scene 1 — A Little Girl with a Big Imagination</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              In Sugarberry Lane...
            </h3>

            <p className="text-sm sm:text-base text-[#664635] leading-relaxed max-w-2xl">
              In a colorful little town called Sugarberry Lane lived a curious girl named Coco.
              She had a short brown bob haircut, sparkling brown eyes, signature strawberry hair clips,
              and an enormous love for baking. While other children collected toys, Coco collected cake recipes,
              colorful sprinkles, and unusual spices. She believed that a little sweetness could make an ordinary day extraordinary!
            </p>

            {/* Interactive Touch Point: Floating Ingredients to Tap */}
            <div className="bg-[#FFF9F2] p-5 rounded-3xl border border-[#FDE68A] space-y-3">
              <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider block">
                ✨ Tap Coco&#39;s Secret Ingredients to uncover her childhood habits:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => unlockFact('berries', 'Coco planted 50 wild strawberry bushes!')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    discoveredFacts.includes('berries')
                      ? 'bg-[#FFE4E9] border-[#D81159] text-[#D81159]'
                      : 'bg-white border-[#EADBCE] hover:border-[#FFCCD5]'
                  }`}
                >
                  <div className="text-2xl mb-1">🍓 Wild Berries</div>
                  <p className="text-xs">
                    {discoveredFacts.includes('berries')
                      ? 'Coco hand-picks berries every dawn before school starts!'
                      : 'Tap to inspect...'}
                  </p>
                </button>

                <button
                  onClick={() => unlockFact('whisk', 'Her wooden whisk was carved by her grandfather!')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    discoveredFacts.includes('whisk')
                      ? 'bg-[#FFE4E9] border-[#D81159] text-[#D81159]'
                      : 'bg-white border-[#EADBCE] hover:border-[#FFCCD5]'
                  }`}
                >
                  <div className="text-2xl mb-1">🥄 Little Whisk</div>
                  <p className="text-xs">
                    {discoveredFacts.includes('whisk')
                      ? 'Grandpa carved it from Sugarberry oak wood!'
                      : 'Tap to inspect...'}
                  </p>
                </button>

                <button
                  onClick={() => unlockFact('vanilla', 'Madagascar vanilla beans in her apron pocket!')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    discoveredFacts.includes('vanilla')
                      ? 'bg-[#FFE4E9] border-[#D81159] text-[#D81159]'
                      : 'bg-white border-[#EADBCE] hover:border-[#FFCCD5]'
                  }`}
                >
                  <div className="text-2xl mb-1">✨ Vanilla Sugar</div>
                  <p className="text-xs">
                    {discoveredFacts.includes('vanilla')
                      ? 'Coco always carried vanilla sugar for good luck!'
                      : 'Tap to inspect...'}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCENE 2 ================= */}
        {currentScene === 2 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF2DF] text-[#B45309] text-xs font-bold">
              <span>📖</span>
              <span>Scene 2 — Grandma&#39;s Mysterious Recipe Book</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              The Rain, The Attic, and The Book
            </h3>

            <p className="text-sm sm:text-base text-[#664635] leading-relaxed max-w-2xl">
              One rainy afternoon, Coco climbed up into the attic of her grandmother Hazel’s bakery.
              Tucked inside an old flour chest, she discovered a leather-bound recipe book filled with
              hand-drawn illustrations, strange baking temperatures, and one glowing blank page...
            </p>

            {/* Interactive Touch Point: Click to Open the Mysterious Book */}
            <div className="bg-[#FFFDF9] p-6 rounded-3xl border-2 border-[#EADBCE] text-center max-w-lg mx-auto space-y-4">
              {!isBookOpened ? (
                <div
                  onClick={() => {
                    sound.playVictory();
                    setIsBookOpened(true);
                  }}
                  className="cursor-pointer group p-8 rounded-2xl bg-[#FFF9F2] border-2 border-dashed border-[#D97706] hover:bg-[#FFEFC7] transition-all transform hover:scale-102"
                >
                  <BookOpen size={48} className="mx-auto text-[#D97706] group-hover:rotate-6 transition-transform" />
                  <span className="font-extrabold text-sm text-[#78350F] block mt-2">
                    Tap to open Grandma&#39;s Secret Recipe Book 📖
                  </span>
                  <span className="text-xs text-[#B45309]">The blank parchment is warm to the touch!</span>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FFF9F2] border-2 border-[#FFD1DC] text-left space-y-3 animate-gentle-float">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D81159]">
                    <span>🍓</span>
                    <span>The Final Page Inscription:</span>
                  </div>
                  <blockquote className="text-base sm:text-lg font-serif italic text-[#3D2314] font-bold border-l-4 border-[#D81159] pl-3 py-1">
                    &ldquo;Every feeling has a flavor. Every person deserves a little sweetness.&rdquo;
                  </blockquote>
                  <p className="text-xs text-[#664635]">
                    A glowing strawberry watermark appeared beneath the script! That day, Coco made a vow to bake cakes that healed hearts.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCENE 3 ================= */}
        {currentScene === 3 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE4E9] text-[#D81159] text-xs font-bold">
              <span>🎂</span>
              <span>Scene 3 — The Great Frosting Disaster</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              Too Much Powdered Sugar!
            </h3>

            <p className="text-sm sm:text-base text-[#664635] leading-relaxed max-w-2xl">
              Excited to test her very first original recipe, Coco cranked the kitchen mixer to maximum speed!
              Frosting hit the ceiling, a mountain of rainbow sprinkles showered the floor, and a three-layer
              cake slid across the table like a hockey puck! Instead of crying, Coco burst out laughing:
              &ldquo;What if baking was a race against the timer?&rdquo;
            </p>

            {/* Interactive Touch Point: Tap the Bowl for Frosting Explosion */}
            <div className="text-center py-4">
              <button
                onClick={() => {
                  sound.playSquish();
                  sound.playSprinkles();
                  setHasExploded(true);
                }}
                className="px-6 py-4 rounded-3xl bg-[#FFF5F7] border-2 border-[#FFCCD5] hover:border-[#D81159] hover:bg-[#FFE4E9] transition-all transform hover:scale-105 active:scale-95 shadow-xs"
              >
                <div className="text-4xl mb-1">{hasExploded ? '💥🍰' : '🥣'}</div>
                <span className="font-extrabold text-sm text-[#D81159] block">
                  {hasExploded ? 'Frosting Everywhere!' : 'Tap the Mixing Bowl to Whip!'}
                </span>
                <span className="text-xs text-[#8C7A70]">
                  {hasExploded
                    ? 'And thus, Cake Chaos was born!'
                    : 'Warning: Might cause kitchen splatter!'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SCENE 4 ================= */}
        {currentScene === 4 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#9333EA] text-xs font-bold">
              <span>💗</span>
              <span>Scene 4 — Cakes with Feelings</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              Baking What People Truly Need
            </h3>

            <p className="text-sm sm:text-base text-[#664635] leading-relaxed max-w-2xl">
              The next morning, Coco watched the townsfolk walk down Sugarberry Lane. Some had tired shoulders,
              some were nervous for a job interview, and others were giggling in love. She realized:
              people don&apos;t just buy cake for their stomachs—they buy cake for their feelings!
            </p>

            {/* Interactive Touch Point: Mood Selector Preview */}
            <div className="bg-[#FAF5FF] p-5 rounded-3xl border border-[#E9D5FF] space-y-3">
              <span className="text-xs font-bold text-[#9333EA] uppercase tracking-wider block">
                Tap an emotion to see Coco&#39;s mini prescription:
              </span>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    sound.playChime(660);
                    setSelectedStoryMood('tired');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedStoryMood === 'tired'
                      ? 'bg-white border-[#9333EA] text-[#9333EA] shadow-xs'
                      : 'bg-white/60 border-transparent hover:bg-white'
                  }`}
                >
                  <span className="text-2xl block mb-1">😴</span>
                  <span className="text-xs font-bold">Sleepy & Tired</span>
                </button>

                <button
                  onClick={() => {
                    sound.playChime(780);
                    setSelectedStoryMood('cheer');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedStoryMood === 'cheer'
                      ? 'bg-white border-[#9333EA] text-[#9333EA] shadow-xs'
                      : 'bg-white/60 border-transparent hover:bg-white'
                  }`}
                >
                  <span className="text-2xl block mb-1">🥳</span>
                  <span className="text-xs font-bold">Celebrating</span>
                </button>

                <button
                  onClick={() => {
                    sound.playChime(520);
                    setSelectedStoryMood('hug');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedStoryMood === 'hug'
                      ? 'bg-white border-[#9333EA] text-[#9333EA] shadow-xs'
                      : 'bg-white/60 border-transparent hover:bg-white'
                  }`}
                >
                  <span className="text-2xl block mb-1">🥺</span>
                  <span className="text-xs font-bold">Needing Hug</span>
                </button>
              </div>

              {selectedStoryMood && (
                <div className="bg-white p-3 rounded-xl border border-[#E9D5FF] text-xs text-[#664635] mt-2">
                  {selectedStoryMood === 'tired' && '🍯 Coco prescribed: Warm Chamomile Honey Cake with warm milk!'}
                  {selectedStoryMood === 'cheer' && '🍓 Coco prescribed: Triple Strawberry Confetti Sparkler with extra stars!'}
                  {selectedStoryMood === 'hug' && '🍫 Coco prescribed: Molten Belgian Chocolate Ganache with salted caramel!'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCENE 5 ================= */}
        {currentScene === 5 && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8F0] text-[#059669] text-xs font-bold">
              <span>👀</span>
              <span>Scene 5 — Is It Cake or Is It Fake?</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              The Master of Illusion
            </h3>

            <p className="text-sm sm:text-base text-[#664635] leading-relaxed max-w-2xl">
              Coco got so skilled with food dyes, airbrushing, and sugar paste sculpting that she began playing
              playful pranks! She sculpted cake sneakers that looked like real leather, potted succulents made
              of sweet almond paste, and juicy cheeseburgers made of sponge cake.
              Customers rubbed their eyes in disbelief!
            </p>

            {/* Interactive Touch Point: Quick Guess Mini-Test */}
            <div className="bg-[#F0FDF4] p-5 rounded-3xl border border-[#BBF7D0] max-w-md mx-auto text-center space-y-3">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider block">
                Quick Story Inspection:
              </span>
              <p className="text-xs text-[#166534]">
                Coco placed a sculpted vintage teapot on the counter. Is it made of porcelain or carrot cake?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playVictory();
                    setStoryGuess('cake');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    storyGuess === 'cake'
                      ? 'bg-[#059669] text-white border-[#059669]'
                      : 'bg-white text-[#059669] border-[#BBF7D0]'
                  }`}
                >
                  It&#39;s Cake! 🍰
                </button>
                <button
                  onClick={() => {
                    sound.playOops();
                    setStoryGuess('fake');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    storyGuess === 'fake'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-[#664635] border-[#BBF7D0]'
                  }`}
                >
                  It&#39;s Fake! 🫖
                </button>
              </div>

              {storyGuess && (
                <div className="text-xs font-semibold text-[#166534] pt-1">
                  {storyGuess === 'cake'
                    ? '🎯 Spot on! Sliced open, it was 100% spiced carrot cake with cream cheese!'
                    : 'Tricked! Coco giggles—it looked like genuine porcelain, but was sweet cake!'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCENE 6 ================= */}
        {currentScene === 6 && (
          <div className="space-y-6 text-center max-w-xl mx-auto py-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE4E9] text-[#D81159] text-xs font-bold">
              <span>✨</span>
              <span>Scene 6 — Welcome to Coco Crumble!</span>
            </div>

            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFE4E9] flex items-center justify-center text-4xl shadow-inner">
              🍓
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-[#3D2314]">
              The Bakery Doors Swing Open!
            </h3>

            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-[#FDE68A] text-left space-y-2">
              <span className="text-xs font-bold text-[#B45309] block">Coco beams at you:</span>
              <p className="text-sm sm:text-base font-medium text-[#78350F] italic">
                &ldquo;Well, look who made it to my bakery! Ready to bake up some chaos?&rdquo;
              </p>
              <div className="text-xs font-bold text-[#D81159] pt-1">
                Tagline: &ldquo;Life is short. Add extra frosting!&rdquo;
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onEnterBakery}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Enter the Bakery 🍰
              </button>
            </div>
          </div>
        )}

        {/* Scene Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#F2E5D3] mt-6">
          <button
            onClick={handleBack}
            disabled={currentScene === 1}
            className="px-4 py-2 rounded-xl border border-[#EADBCE] text-xs font-bold text-[#664635] hover:bg-[#FAF0E6] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Previous Scene</span>
          </button>

          {currentScene < totalScenes ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-[#D81159] hover:bg-[#B50E49] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Next Scene</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F2E0D0] text-[#664635] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Replay Story</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
