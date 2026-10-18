import React from 'react';
import { CocoMascot } from '../mascot/CocoMascot';
import { Timer, HeartHandshake, Eye, Sparkles, BookOpen, Cookie, Flame } from 'lucide-react';
import { sound } from '../../services/soundEngine';
import { NavTab } from '../navigation/TopNav';

interface LandingHeroProps {
  onNavigate: (tab: NavTab) => void;
  visitorCount: number;
  onClipClick: () => void;
  isGoldenMode: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onNavigate,
  visitorCount,
  onClipClick,
  isGoldenMode,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF5F7] via-[#FFFDF7] to-[#FFF0E6] border border-[#F8D7DA] p-6 sm:p-10 md:p-12 shadow-sm">
        {/* Subtle Decorative Confectionery Stamps */}
        <div className="absolute top-4 right-6 text-3xl opacity-20 pointer-events-none select-none">
          🍰
        </div>
        <div className="absolute bottom-4 left-6 text-2xl opacity-20 pointer-events-none select-none">
          🧁
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Storybook Headline & Bakery Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE4E9] border border-[#FFCCD5] text-[#D81159] text-xs font-bold tracking-wide">
              <span>🍓</span>
              <span>Sugarberry Lane&#39;s Most Imaginative Confectionery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#3D2314] tracking-tight leading-[1.15]">
              Life is short.{' '}
              <span className="text-[#D81159] underline decoration-[#FFCCD5] decoration-wavy decoration-2">
                Add extra frosting!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#664635] leading-relaxed max-w-xl font-normal">
              Welcome to <strong>Coco Crumble</strong>! Grab a bowl and whisk alongside Coco.
              Beat the rush in fast-paced cake decorating, discover which cake speaks to your mood,
              or test your senses in our mind-bending Cake or Fake challenge.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playVictory();
                  onNavigate('chaos');
                }}
                className="px-6 py-3 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <Flame size={18} />
                <span>Play Cake Chaos</span>
              </button>

              <button
                onClick={() => {
                  sound.playChime();
                  onNavigate('story');
                }}
                className="px-5 py-3 rounded-2xl bg-[#FFF2DF] hover:bg-[#FFE6C4] text-[#78350F] border border-[#FCD34D] font-bold text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <BookOpen size={18} />
                <span>Read Origin Story</span>
              </button>
            </div>

            {/* Visitor Counter & Baker Note */}
            <div className="pt-2 flex items-center gap-4 text-xs font-medium text-[#8C7A70]">
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#EADBCE] shadow-2xs">
                <Cookie size={14} className="text-[#D97706]" />
                <span>You are sweet visitor:</span>
                <span className="font-mono font-bold text-[#3D2314] tabular-nums">
                  #{visitorCount.toLocaleString()}
                </span>
              </span>
              <span className="hidden sm:inline">· Oven preheated to 350°F</span>
            </div>
          </div>

          {/* Right Column: Coco the Chibi Baker Focus */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[#FFCCD5]/40 rounded-full blur-2xl transform scale-90" />
              <CocoMascot
                size="hero"
                onClipClick={onClipClick}
                isGoldenMode={isGoldenMode}
                speechText="Well, look who made it to my bakery! Ready to bake?"
              />
            </div>
            <p className="text-xs text-[#8C7A70] mt-1 text-center italic">
              Tap Coco or her strawberry clips to hear her thoughts!
            </p>
          </div>
        </div>
      </section>

      {/* Bakery Counter Visual Rest Section */}
      <section className="relative rounded-3xl overflow-hidden border border-[#F2E5D3] shadow-sm max-w-6xl mx-auto">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src="/src/assets/images/bakery_showcase_spread_1792304278074.jpg"
            alt="Charming storybook bakery counter with fresh cakes and pastries"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26150B]/85 via-[#26150B]/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFCCD5]">
              Daily Fresh Batch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Sugarberry Lane Baking Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-[#F7E7CE] max-w-lg mt-1">
              Every morning at 5:00 AM, Coco dusts the tables with powdered sugar and starts whisking up joy.
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Core Activities Grid */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D81159]">
            Three Confectionery Adventures
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#3D2314]">
            Choose Your Bakery Station
          </h2>
          <p className="text-sm text-[#664635] max-w-md mx-auto">
            From rapid-fire decorating under pressure to emotional cakes and visual illusion challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Activity 1: Cake Chaos */}
          <div
            onClick={() => {
              sound.playVictory();
              onNavigate('chaos');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-[#FFD1DC] p-6 shadow-xs hover:shadow-md hover:border-[#D81159] transition-all transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE4E9] text-[#D81159] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Timer size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
                  Mini-Game 01
                </span>
                <h3 className="text-xl font-bold text-[#3D2314] mt-1 group-hover:text-[#D81159] transition-colors">
                  Cake Chaos 🎂
                </h3>
                <p className="text-xs sm:text-sm text-[#664635] mt-2 leading-relaxed">
                  The bakery queue is out the door! Read the customer order slip, pick the exact frosting,
                  drizzle, and toppings before the 45-second timer runs out.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F7EAE1] flex items-center justify-between text-xs font-bold text-[#D81159]">
              <span>Start Decorating</span>
              <span>→</span>
            </div>
          </div>

          {/* Activity 2: Cake for Your Mood */}
          <div
            onClick={() => {
              sound.playChime();
              onNavigate('mood');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-[#EADDF8] p-6 shadow-xs hover:shadow-md hover:border-[#9333EA] transition-all transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <HeartHandshake size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#9333EA] uppercase tracking-wider">
                  Discovery 02
                </span>
                <h3 className="text-xl font-bold text-[#3D2314] mt-1 group-hover:text-[#9333EA] transition-colors">
                  Cake for Your Mood 💗
                </h3>
                <p className="text-xs sm:text-sm text-[#664635] mt-2 leading-relaxed">
                  Are you celebrating, exhausted, nostalgic, or stressed? Select your true emotion and let Coco
                  prescribe your personalized comfort cake recipe.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2EBF7] flex items-center justify-between text-xs font-bold text-[#9333EA]">
              <span>Discover Flavor</span>
              <span>→</span>
            </div>
          </div>

          {/* Activity 3: Cake or Fake? */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('fake');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-[#D1F2E2] p-6 shadow-xs hover:shadow-md hover:border-[#059669] transition-all transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F8F0] text-[#059669] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                  Visual Challenge 03
                </span>
                <h3 className="text-xl font-bold text-[#3D2314] mt-1 group-hover:text-[#059669] transition-colors">
                  Cake or Fake? 👀
                </h3>
                <p className="text-xs sm:text-sm text-[#664635] mt-2 leading-relaxed">
                  Is that sneaker really a shoe or a triple-layer chocolate mousse? Test your sharp eyes across
                  6 mind-boggling hyper-realistic cake sculptures.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E5F5ED] flex items-center justify-between text-xs font-bold text-[#059669]">
              <span>Inspect Objects</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teaser Card */}
      <section className="max-w-6xl mx-auto rounded-3xl bg-[#FFF9F2] border border-[#FDE68A] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Interactive Storybook</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#3D2314]">
            How did Coco start the bakery?
          </h3>
          <p className="text-xs sm:text-sm text-[#78350F] max-w-xl">
            Step through 6 animated chapters: find Grandma&#39;s secret blank recipe book, survive the Great
            Frosting Explosion, and unlock the doors of Coco Crumble.
          </p>
        </div>
        <button
          onClick={() => {
            sound.playChime();
            onNavigate('story');
          }}
          className="whitespace-nowrap px-6 py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-xs transition-all shrink-0"
        >
          Open Chapter 1 📖
        </button>
      </section>
    </div>
  );
};
