import React, { useState } from 'react';
import { Heart, Sparkles, Moon, Smile, Zap, RefreshCw, Coffee, AlertCircle } from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface MoodRecommendation {
  id: string;
  moodName: string;
  emoji: string;
  tagline: string;
  cakeName: string;
  flavorProfile: string;
  paletteColors: string[];
  visualDescription: string;
  cocoAdvice: string;
  magicalIngredient: string;
}

const MOODS: MoodRecommendation[] = [
  {
    id: 'happy',
    moodName: 'Happy & Celebrating',
    emoji: '🥳',
    tagline: 'When your heart feels like dancing in sugar showers!',
    cakeName: 'Sugarberry Confetti Crown',
    flavorProfile: 'Wild Strawberry Chiffon with Whipped Mascarpone & Champagne Berry Compote',
    paletteColors: ['#FF8BA7', '#FFD166', '#FFE4E9'],
    visualDescription:
      'A triple-tiered pastel pink cloud dusted in sparkling gold sugar crystals, crowned with fresh Sugarberry Lane strawberries and crunchy rainbow macarons.',
    cocoAdvice:
      'Joy is contagious! When you are this happy, your cake should have enough extra sprinkles to share with everyone on the block.',
    magicalIngredient: 'Two tablespoons of pure festival giggles',
  },
  {
    id: 'sleepy',
    moodName: 'Sleepy & Cozy',
    emoji: '😴',
    tagline: 'Soft pajamas, rain on the window, and heavy eyelids.',
    cakeName: 'Warm Chamomile Honey Pillow',
    flavorProfile: 'Toasted Oat & Honey Sponge with Lavender Blossom Cream & Brown Butter Crumb',
    paletteColors: ['#F3E8FF', '#FDE68A', '#E9D5FF'],
    visualDescription:
      'A fluffy, pillowy chiffon cake brushed with golden honey syrup, wrapped in gentle lavender buttercream and topped with toasted almond flakes.',
    cocoAdvice:
      'Wrap yourself in a blanket and eat this with warm milk. No alarms allowed for the next twelve hours!',
    magicalIngredient: 'Steeped dreams and quiet twilight',
  },
  {
    id: 'sad',
    moodName: 'Sad / Needing Comfort',
    emoji: '🥺',
    tagline: 'For gray days when you just want a warm, understanding hug.',
    cakeName: 'Triple Chocolate Comfort Hug',
    flavorProfile: 'Molten Belgian Dark Chocolate Ganache, Salted Caramel Core & Velvety Cocoa Sponge',
    paletteColors: ['#4A2810', '#D4A373', '#2B170B'],
    visualDescription:
      'A warm, velvety dark chocolate cake that gently oozes warm salted caramel when sliced, topped with delicate chocolate curls and sea salt.',
    cocoAdvice:
      'It is okay to have sad days. Grandma always told me chocolate does not solve all problems, but it gives you strength to face tomorrow.',
    magicalIngredient: 'Unconditional love and warm cocoa hugs',
  },
  {
    id: 'energetic',
    moodName: 'Energetic & Bouncy',
    emoji: '⚡',
    tagline: 'Full of creative sparks and ready to run up a mountain!',
    cakeName: 'Zesty Yuzu Citrus Sparkler',
    flavorProfile: 'Meyer Lemon Curd, Sparkling Yuzu Glaze & Popping Candy Sugar Dust',
    paletteColors: ['#FEF08A', '#86EFAC', '#FDE047'],
    visualDescription:
      'A sunshine-bright citrus sponge topped with tangy curd waves, candied lemon spirals, and popping candy that crackles on your tongue!',
    cocoAdvice:
      'Channel that lightning bolt into something wild! Bake three cakes, paint a picture, or dance across the kitchen with your whisk!',
    magicalIngredient: 'One sunbeam harvested at noon',
  },
  {
    id: 'romantic',
    moodName: 'Romantic & Dreamy',
    emoji: '💕',
    tagline: 'Butterflies in the stomach and blushing cheeks.',
    cakeName: 'Velvet Rose & Raspberry Kiss',
    flavorProfile: 'Rosewater Infused Chiffon with Ruby Chocolate Mousse & Tart Raspberry Jelly',
    paletteColors: ['#FDA4AF', '#E11D48', '#FFE4E6'],
    visualDescription:
      'An elegant heart-shaped ruby cake glazed in mirror rose shine, adorned with candied pink rose petals and fresh tart raspberries.',
    cocoAdvice:
      'Whether you are dreaming of someone special or just falling in love with a peaceful moment, celebrate it with ruby chocolate.',
    magicalIngredient: 'Sweet secret whispers and edible rose petals',
  },
  {
    id: 'stressed',
    moodName: 'Stressed / Overwhelmed',
    emoji: '🤯',
    tagline: 'Too many tabs open in your brain and a runaway to-do list.',
    cakeName: 'Zen Garden Matcha Serenity',
    flavorProfile: 'Ceremonial Uji Matcha Sponge, Roasted Sesame Cream & White Peach Gelee',
    paletteColors: ['#86EFAC', '#BBF7D0', '#4ADE80'],
    visualDescription:
      'A tranquil square cake iced in calming jade-green matcha cream, delicately raked like a zen rock garden and topped with candied white peach slices.',
    cocoAdvice:
      'Take three slow, deep breaths with me. Close your eyes. Smell the earthy green tea. Everything will get done in time, step by step.',
    magicalIngredient: 'Ten minutes of absolute quiet and mindful breathing',
  },
];

export const MoodCakeFinder: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodRecommendation | null>(null);

  const handleSelectMood = (mood: MoodRecommendation) => {
    sound.playChime();
    setSelectedMood(mood);
  };

  const handleReset = () => {
    sound.playPop();
    setSelectedMood(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9333EA] uppercase tracking-wider">
          <Heart size={14} />
          <span>Emotional Confectionery Matcher</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2314]">
          Cake for Your Mood
        </h2>
        <p className="text-sm text-[#664635] max-w-lg mx-auto">
          Grandma Hazel’s rule: &ldquo;Every feeling has a flavor.&rdquo; Tell Coco how your soul is
          feeling right now, and receive your custom bakery remedy.
        </p>
      </div>

      {/* Mood Selector Grid */}
      {!selectedMood && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#8C7A70] uppercase tracking-wider block text-center">
            Select Your Current Vibe:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleSelectMood(mood)}
                className="group p-5 rounded-3xl bg-white border-2 border-[#EADBCE] hover:border-[#D81159] hover:bg-[#FFFDF9] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between h-40 transform hover:-translate-y-1 active:translate-y-0"
              >
                <div>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {mood.emoji}
                  </div>
                  <h3 className="font-bold text-base text-[#3D2314] group-hover:text-[#D81159] transition-colors">
                    {mood.moodName}
                  </h3>
                  <p className="text-xs text-[#664635] mt-1 leading-relaxed">
                    {mood.tagline}
                  </p>
                </div>

                <div className="text-[11px] font-bold text-[#D81159] flex items-center justify-between pt-2 border-t border-[#F5EFEB]">
                  <span>Discover prescription</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Cake Reveal Card */}
      {selectedMood && (
        <div className="rounded-3xl bg-white border-2 border-[#FFD1DC] p-6 sm:p-10 shadow-sm space-y-8 animate-gentle-float">
          {/* Top Banner Tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5EFEB] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-[#FFE4E9] rounded-2xl shadow-inner">
                {selectedMood.emoji}
              </span>
              <div>
                <span className="text-xs font-bold text-[#9333EA] uppercase tracking-wider">
                  Coco&#39;s Prescription For: {selectedMood.moodName}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#3D2314]">
                  {selectedMood.cakeName}
                </h3>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F2E0D0] text-[#664635] text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-center"
            >
              <RefreshCw size={14} />
              <span>Choose Another Mood</span>
            </button>
          </div>

          {/* Cake Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Confectionery Mockup */}
            <div className="md:col-span-5 rounded-3xl bg-gradient-to-br from-[#FFF5F7] to-[#FAF0E6] border border-[#F2E5D3] p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[260px]">
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full shadow-md flex items-center justify-center text-5xl transition-transform hover:scale-105"
                  style={{ backgroundColor: selectedMood.paletteColors[0] }}
                >
                  🍰
                </div>
                {/* Palette Swatches */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {selectedMood.paletteColors.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-white shadow-2xs inline-block"
                      style={{ backgroundColor: color }}
                      title={`Palette color ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-bold text-[#8C7A70] italic">
                Artisanal Sugarberry Lane Recipe
              </span>
            </div>

            {/* Recipe and Flavor Profile */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div>
                <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
                  Flavor Profile
                </span>
                <p className="text-sm font-semibold text-[#3D2314] mt-0.5">
                  {selectedMood.flavorProfile}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                  Visual Appearance & Textures
                </span>
                <p className="text-xs sm:text-sm text-[#664635] mt-0.5 leading-relaxed">
                  {selectedMood.visualDescription}
                </p>
              </div>

              <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#FDE68A] text-xs space-y-1">
                <span className="font-bold text-[#78350F] flex items-center gap-1">
                  <Sparkles size={13} className="text-[#D97706]" />
                  <span>Secret Magical Ingredient:</span>
                </span>
                <p className="text-[#92400E] font-medium italic">
                  {selectedMood.magicalIngredient}
                </p>
              </div>
            </div>
          </div>

          {/* Coco's Personal Word */}
          <div className="bg-[#FFE4E9]/50 rounded-2xl p-5 border border-[#FFCCD5] flex items-start gap-4">
            <span className="text-2xl">🍓</span>
            <div className="text-xs sm:text-sm text-[#664635] leading-relaxed">
              <strong className="text-[#D81159] block mb-0.5">Coco&#39;s Bakery Note:</strong>
              &ldquo;{selectedMood.cocoAdvice}&rdquo;
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
