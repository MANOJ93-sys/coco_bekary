import React, { useState, useEffect } from 'react';
import { Timer, RotateCcw, Award, CheckCircle2, XCircle, Play, Sparkles } from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface Order {
  customerName: string;
  customerNote: string;
  baseFlavor: string;
  frostingColor: string;
  drizzle: string;
  toppings: string[];
}

interface PlayerCake {
  baseFlavor: string;
  frostingColor: string;
  drizzle: string;
  toppings: string[];
}

const BASES = [
  { id: 'vanilla', name: 'Vanilla Sponge', color: '#FDF0D5', border: '#EAD7A9' },
  { id: 'chocolate', name: 'Choco Fudge', color: '#5C3826', border: '#402619' },
  { id: 'matcha', name: 'Matcha Velvet', color: '#97A97C', border: '#78895E' },
  { id: 'berry', name: 'Strawberry Swirl', color: '#FFAFCC', border: '#E78EA9' },
];

const FROSTINGS = [
  { id: 'strawberry', name: 'Strawberry Pink', color: '#FF758F' },
  { id: 'mint', name: 'Mint Breeze', color: '#A0E8AF' },
  { id: 'cream', name: 'Whipped Cream', color: '#FFFFFF' },
  { id: 'choco', name: 'Choco Ganache', color: '#4A2810' },
  { id: 'lavender', name: 'Lavender Butter', color: '#D8B4E2' },
];

const DRIZZLES = [
  { id: 'none', name: 'No Drizzle', color: 'transparent' },
  { id: 'caramel', name: 'Golden Caramel', color: '#D4A373' },
  { id: 'berry', name: 'Raspberry Glaze', color: '#E63946' },
  { id: 'choco', name: 'Dark Fudge Drip', color: '#2B170B' },
];

const TOPPINGS = [
  { id: 'berries', name: 'Fresh Strawberries', emoji: '🍓' },
  { id: 'sprinkles', name: 'Rainbow Sprinkles', emoji: '✨' },
  { id: 'stars', name: 'Sugar Stars', emoji: '⭐' },
  { id: 'cherries', name: 'Glazed Cherries', emoji: '🍒' },
  { id: 'cookies', name: 'Mini Wafers', emoji: '🍪' },
];

const CUSTOMERS: Order[] = [
  {
    customerName: 'Mayor Berry',
    customerNote: "The town festival is in one hour! Make it strawberry sweet with extra stars!",
    baseFlavor: 'berry',
    frostingColor: 'strawberry',
    drizzle: 'berry',
    toppings: ['berries', 'stars'],
  },
  {
    customerName: 'Professor Sprinkles',
    customerNote: "I have calculated that maximum joy requires chocolate sponge and rainbow sprinkles!",
    baseFlavor: 'chocolate',
    frostingColor: 'cream',
    drizzle: 'choco',
    toppings: ['sprinkles'],
  },
  {
    customerName: 'Grandma Hazel',
    customerNote: "Nothing too loud, dear! A gentle vanilla sponge with whipped cream and caramel.",
    baseFlavor: 'vanilla',
    frostingColor: 'cream',
    drizzle: 'caramel',
    toppings: ['cherries'],
  },
  {
    customerName: 'Detective Crumb',
    customerNote: "I am investigating the mysterious Matcha Velvet cake with mint frosting. Urgent!",
    baseFlavor: 'matcha',
    frostingColor: 'mint',
    drizzle: 'none',
    toppings: ['stars', 'berries'],
  },
];

export const CakeChaosGame: React.FC = () => {
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'RESULT'>('MENU');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [currentOrder, setCurrentOrder] = useState<Order>(CUSTOMERS[0]);
  const [playerCake, setPlayerCake] = useState<PlayerCake>({
    baseFlavor: '',
    frostingColor: '',
    drizzle: 'none',
    toppings: [],
  });

  const [scoreData, setScoreData] = useState<{
    accuracyScore: number;
    speedBonus: number;
    total: number;
    grade: string;
    details: {
      baseMatch: boolean;
      frostingMatch: boolean;
      drizzleMatch: boolean;
      toppingsMatch: boolean;
    };
  }>({
    accuracyScore: 0,
    speedBonus: 0,
    total: 0,
    grade: 'B',
    details: {
      baseMatch: false,
      frostingMatch: false,
      drizzleMatch: false,
      toppingsMatch: false,
    },
  });

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('coco_cake_chaos_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Timer Countdown in PLAYING state
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (timeLeft <= 0) {
      sound.playOops();
      calculateScore(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startNewGame = () => {
    sound.playChime(660);
    // Select random customer order
    const randomCustomer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    setCurrentOrder(randomCustomer);
    setPlayerCake({
      baseFlavor: '',
      frostingColor: '',
      drizzle: 'none',
      toppings: [],
    });
    setTimeLeft(40);
    setGameState('PLAYING');
  };

  const toggleTopping = (toppingId: string) => {
    sound.playSprinkles();
    setPlayerCake((prev) => {
      const exists = prev.toppings.includes(toppingId);
      if (exists) {
        return { ...prev, toppings: prev.toppings.filter((t) => t !== toppingId) };
      }
      return { ...prev, toppings: [...prev.toppings, toppingId] };
    });
  };

  const calculateScore = (timeRanOut = false) => {
    const baseMatch = playerCake.baseFlavor === currentOrder.baseFlavor;
    const frostingMatch = playerCake.frostingColor === currentOrder.frostingColor;
    const drizzleMatch = playerCake.drizzle === currentOrder.drizzle;

    // Check toppings match (both have identical set)
    const expected = [...currentOrder.toppings].sort().join(',');
    const actual = [...playerCake.toppings].sort().join(',');
    const toppingsMatch = expected === actual;

    let accuracy = 0;
    if (baseMatch) accuracy += 25;
    if (frostingMatch) accuracy += 25;
    if (drizzleMatch) accuracy += 25;
    if (toppingsMatch) accuracy += 25;

    const speedBonus = timeRanOut ? 0 : Math.floor(timeLeft * 1.5);
    const total = accuracy + speedBonus;

    let grade = 'C';
    if (total >= 130) grade = 'S';
    else if (total >= 100) grade = 'A';
    else if (total >= 60) grade = 'B';

    if (grade === 'S' || grade === 'A') {
      sound.playVictory();
    } else {
      sound.playOops();
    }

    if (total > highScore) {
      setHighScore(total);
      localStorage.setItem('coco_cake_chaos_highscore', total.toString());
    }

    setScoreData({
      accuracyScore: accuracy,
      speedBonus,
      total,
      grade,
      details: { baseMatch, frostingMatch, drizzleMatch, toppingsMatch },
    });
    setGameState('RESULT');
  };

  const selectedBaseObj = BASES.find((b) => b.id === playerCake.baseFlavor);
  const selectedFrostingObj = FROSTINGS.find((f) => f.id === playerCake.frostingColor);
  const selectedDrizzleObj = DRIZZLES.find((d) => d.id === playerCake.drizzle);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2E5D3] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E63946] uppercase tracking-wider">
            <span>🎂</span>
            <span>Speed Decorating Arcade</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
            Cake Chaos!
          </h2>
          <p className="text-xs sm:text-sm text-[#664635]">
            Match customer orders with precision before the bakery timer expires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#EADBCE] px-3.5 py-1.5 rounded-2xl shadow-2xs text-xs font-bold flex items-center gap-1.5">
            <Award size={16} className="text-[#D97706]" />
            <span>High Score:</span>
            <span className="font-mono text-sm text-[#D81159] tabular-nums">{highScore} pts</span>
          </div>
        </div>
      </div>

      {/* GAME STATE: MENU */}
      {gameState === 'MENU' && (
        <div className="rounded-3xl bg-white border-2 border-[#FFD1DC] p-8 md:p-12 text-center space-y-6 shadow-xs max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFE4E9] flex items-center justify-center text-4xl shadow-inner">
            🎂
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#3D2314]">
              Rush Hour in Sugarberry Lane!
            </h3>
            <p className="text-sm text-[#664635] max-w-md mx-auto leading-relaxed">
              Customers have placed urgent custom cake orders. Assemble the correct sponge base,
              frosting color, drizzle sauce, and garnishes before time runs out.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-lg mx-auto text-xs font-medium text-[#664635] bg-[#FFF9F2] p-4 rounded-2xl border border-[#FDE68A]">
            <div>1. Pick Sponge</div>
            <div>2. Pipe Frosting</div>
            <div>3. Add Drizzle</div>
            <div>4. Top & Submit</div>
          </div>

          <div>
            <button
              onClick={startNewGame}
              className="px-8 py-3.5 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] text-white font-extrabold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 mx-auto"
            >
              <Play size={18} />
              <span>Start Decorating</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME STATE: PLAYING */}
      {gameState === 'PLAYING' && (
        <div className="space-y-6">
          {/* Order Ticket & Timer Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Customer Ticket */}
            <div className="md:col-span-8 rounded-3xl bg-[#FFF9F2] border-2 border-[#FDE68A] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                    Customer Order Slip #{Math.floor(Math.random() * 80 + 10)}
                  </span>
                  <span className="text-xs font-semibold bg-white px-2.5 py-0.5 rounded-full border border-[#FCD34D] text-[#78350F]">
                    {currentOrder.customerName}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#78350F] italic mt-1 font-medium">
                  &ldquo;{currentOrder.customerNote}&rdquo;
                </p>
              </div>

              {/* Required Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#FCD34D]/50 text-xs">
                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Base</span>
                  <span className="font-bold text-[#3D2314] capitalize">
                    {BASES.find((b) => b.id === currentOrder.baseFlavor)?.name}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Frosting</span>
                  <span className="font-bold text-[#3D2314] capitalize">
                    {FROSTINGS.find((f) => f.id === currentOrder.frostingColor)?.name}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Drizzle</span>
                  <span className="font-bold text-[#3D2314] capitalize">
                    {DRIZZLES.find((d) => d.id === currentOrder.drizzle)?.name}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">Toppings</span>
                  <span className="font-bold text-[#3D2314]">
                    {currentOrder.toppings
                      .map((t) => TOPPINGS.find((top) => top.id === t)?.emoji)
                      .join(' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Timer HUD */}
            <div className="md:col-span-4 rounded-3xl bg-white border border-[#EADBCE] p-5 shadow-xs flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] flex items-center gap-1">
                <Timer size={14} className={timeLeft <= 10 ? 'text-[#E63946] animate-bounce' : ''} />
                <span>Bake Timer</span>
              </span>
              <div
                className={`text-4xl sm:text-5xl font-mono font-extrabold my-1 tabular-nums ${
                  timeLeft <= 10 ? 'text-[#E63946] animate-pulse' : 'text-[#3D2314]'
                }`}
              >
                {timeLeft}s
              </div>
              <div className="w-full bg-[#FAF0E6] h-2.5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 10 ? 'bg-[#E63946]' : 'bg-[#D81159]'
                  }`}
                  style={{ width: `${(timeLeft / 40) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Workbench: Preview on Left, Palette on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Cake Platter Preview */}
            <div className="lg:col-span-5 rounded-3xl bg-white border border-[#F2E5D3] p-6 shadow-xs flex flex-col items-center justify-center min-h-[360px] text-center">
              <span className="text-xs font-bold text-[#8C7A70] uppercase tracking-wider mb-2">
                Your Cake Platter
              </span>

              {/* Dynamic SVG / Canvas Cake Rendering */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Platter base */}
                <ellipse cx="128" cy="220" rx="100" ry="25" fill="#EADEC9" stroke="#D1C3AB" strokeWidth="2" />
                <ellipse cx="128" cy="216" rx="90" ry="20" fill="#FFFDF7" />

                {playerCake.baseFlavor ? (
                  <div className="relative flex flex-col items-center">
                    {/* Cake Sponge Tier */}
                    <div
                      className="w-44 h-24 rounded-2xl relative shadow-md transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: selectedBaseObj?.color || '#FDF0D5',
                        border: `3px solid ${selectedBaseObj?.border || '#EAD7A9'}`,
                      }}
                    >
                      {/* Frosting Layer on Top */}
                      {playerCake.frostingColor && (
                        <div
                          className="absolute -top-3 inset-x-0 h-10 rounded-2xl shadow-sm transition-all duration-300"
                          style={{
                            backgroundColor: selectedFrostingObj?.color || '#FFFFFF',
                            border: '2px solid rgba(0,0,0,0.08)',
                          }}
                        />
                      )}

                      {/* Drizzle Overlay */}
                      {playerCake.drizzle !== 'none' && (
                        <div className="absolute -top-2 inset-x-2 h-8 flex justify-around pointer-events-none">
                          <div
                            className="w-3 h-7 rounded-b-full opacity-80"
                            style={{ backgroundColor: selectedDrizzleObj?.color }}
                          />
                          <div
                            className="w-3.5 h-9 rounded-b-full opacity-80"
                            style={{ backgroundColor: selectedDrizzleObj?.color }}
                          />
                          <div
                            className="w-2.5 h-6 rounded-b-full opacity-80"
                            style={{ backgroundColor: selectedDrizzleObj?.color }}
                          />
                          <div
                            className="w-4 h-8 rounded-b-full opacity-80"
                            style={{ backgroundColor: selectedDrizzleObj?.color }}
                          />
                        </div>
                      )}

                      {/* Toppings on Top */}
                      <div className="absolute -top-6 inset-x-0 flex justify-center items-center gap-2 text-2xl select-none z-10">
                        {playerCake.toppings.map((tId) => {
                          const top = TOPPINGS.find((item) => item.id === tId);
                          return (
                            <span key={tId} className="animate-bounce drop-shadow-sm">
                              {top?.emoji}
                            </span>
                          );
                        })}
                      </div>

                      <span className="text-xs font-bold opacity-40 select-none">
                        {selectedBaseObj?.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-[#E5D7BE] rounded-3xl text-xs text-[#8C7A70]">
                    <span>Select a cake sponge flavor to start building!</span>
                  </div>
                )}
              </div>

              {/* Quick Status / Warnings */}
              <div className="text-xs text-[#664635] mt-4 font-medium">
                {!playerCake.baseFlavor && '⚠️ Sponge missing'}
                {playerCake.baseFlavor && !playerCake.frostingColor && '⚠️ Needs frosting'}
                {playerCake.baseFlavor && playerCake.frostingColor && '✨ Ready to garnish & submit!'}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => calculateScore(false)}
                disabled={!playerCake.baseFlavor}
                className="w-full mt-4 py-3 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] disabled:bg-[#E2D5C7] disabled:text-[#8C7A70] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                <span>Submit to Customer</span>
              </button>
            </div>

            {/* Interactive Palette Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1: Base Sponge */}
              <div className="bg-white p-5 rounded-3xl border border-[#F2E5D3] shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider block">
                  1. Sponge Base Flavor
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BASES.map((base) => {
                    const isSelected = playerCake.baseFlavor === base.id;
                    return (
                      <button
                        key={base.id}
                        onClick={() => {
                          sound.playPop();
                          setPlayerCake((p) => ({ ...p, baseFlavor: base.id }));
                        }}
                        className={`p-3 rounded-2xl text-xs font-bold text-center border-2 transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#D81159] bg-[#FFE4E9] text-[#D81159] shadow-xs scale-102'
                            : 'border-[#F2E5D3] bg-[#FFFDF7] text-[#664635] hover:border-[#FFCCD5]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: base.color }}
                        />
                        <span>{base.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Frosting Color */}
              <div className="bg-white p-5 rounded-3xl border border-[#F2E5D3] shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#D81159] uppercase tracking-wider block">
                  2. Pipe Frosting
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {FROSTINGS.map((frosting) => {
                    const isSelected = playerCake.frostingColor === frosting.id;
                    return (
                      <button
                        key={frosting.id}
                        onClick={() => {
                          sound.playSquish();
                          setPlayerCake((p) => ({ ...p, frostingColor: frosting.id }));
                        }}
                        className={`p-2.5 rounded-2xl text-xs font-bold text-center border-2 transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'border-[#D81159] bg-[#FFE4E9] text-[#D81159] shadow-xs'
                            : 'border-[#F2E5D3] bg-[#FFFDF7] text-[#664635] hover:border-[#FFCCD5]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: frosting.color }}
                        />
                        <span className="text-[11px] leading-tight">{frosting.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Drizzle Sauce */}
              <div className="bg-white p-5 rounded-3xl border border-[#F2E5D3] shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider block">
                  3. Drizzle Sauce
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DRIZZLES.map((drizzle) => {
                    const isSelected = playerCake.drizzle === drizzle.id;
                    return (
                      <button
                        key={drizzle.id}
                        onClick={() => {
                          sound.playPop();
                          setPlayerCake((p) => ({ ...p, drizzle: drizzle.id }));
                        }}
                        className={`p-2.5 rounded-2xl text-xs font-bold text-center border-2 transition-all ${
                          isSelected
                            ? 'border-[#D81159] bg-[#FFE4E9] text-[#D81159] shadow-xs'
                            : 'border-[#F2E5D3] bg-[#FFFDF7] text-[#664635] hover:border-[#FFCCD5]'
                        }`}
                      >
                        {drizzle.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Toppings & Garnishes */}
              <div className="bg-white p-5 rounded-3xl border border-[#F2E5D3] shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider block">
                  4. Garnishes & Sprinkles (Select all that apply)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPPINGS.map((topping) => {
                    const isSelected = playerCake.toppings.includes(topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        className={`p-2.5 rounded-2xl text-xs font-bold text-left border-2 transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'border-[#059669] bg-[#E6F8F0] text-[#059669] shadow-xs'
                            : 'border-[#F2E5D3] bg-[#FFFDF7] text-[#664635] hover:border-[#A7F3D0]'
                        }`}
                      >
                        <span className="text-base">{topping.emoji}</span>
                        <span>{topping.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME STATE: RESULT */}
      {gameState === 'RESULT' && (
        <div className="rounded-3xl bg-white border-2 border-[#FFD1DC] p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFE4E9] text-[#D81159] flex items-center justify-center text-4xl shadow-inner font-black">
            {scoreData.grade}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
              {scoreData.grade === 'S'
                ? '⭐ Master Pastry Chef Tier'
                : scoreData.grade === 'A'
                ? '✨ Confectionery Whiz Tier'
                : scoreData.grade === 'B'
                ? '🧁 Sweet Bakery Apprentice'
                : '🥣 Flour Splat Disaster!'}
            </span>
            <h3 className="text-3xl font-black text-[#3D2314]">
              {scoreData.total} Total Points!
            </h3>
            <p className="text-xs sm:text-sm text-[#664635] max-w-md mx-auto">
              {scoreData.grade === 'S'
                ? "Incredible job! Coco says: You decorated with the speed and elegance of a master baker!"
                : scoreData.grade === 'A'
                ? "Wonderful work! The customer left with a beaming smile and a box full of sweetness."
                : "A tasty attempt! With a little extra practice, you'll be running the morning bakery line."}
            </p>
          </div>

          {/* Breakdown Card */}
          <div className="bg-[#FFF9F2] p-4 sm:p-6 rounded-2xl border border-[#FDE68A] space-y-3 text-xs text-left max-w-md mx-auto">
            <div className="flex justify-between items-center py-1 border-b border-[#FCD34D]/40">
              <span className="flex items-center gap-1.5 font-medium">
                {scoreData.details.baseMatch ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <XCircle size={14} className="text-rose-500" />
                )}
                <span>Sponge Base Accuracy:</span>
              </span>
              <span className="font-bold tabular-nums">
                {scoreData.details.baseMatch ? '+25 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#FCD34D]/40">
              <span className="flex items-center gap-1.5 font-medium">
                {scoreData.details.frostingMatch ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <XCircle size={14} className="text-rose-500" />
                )}
                <span>Frosting Color Match:</span>
              </span>
              <span className="font-bold tabular-nums">
                {scoreData.details.frostingMatch ? '+25 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#FCD34D]/40">
              <span className="flex items-center gap-1.5 font-medium">
                {scoreData.details.drizzleMatch ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <XCircle size={14} className="text-rose-500" />
                )}
                <span>Drizzle Accuracy:</span>
              </span>
              <span className="font-bold tabular-nums">
                {scoreData.details.drizzleMatch ? '+25 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#FCD34D]/40">
              <span className="flex items-center gap-1.5 font-medium">
                {scoreData.details.toppingsMatch ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <XCircle size={14} className="text-rose-500" />
                )}
                <span>Garnishes & Sprinkles:</span>
              </span>
              <span className="font-bold tabular-nums">
                {scoreData.details.toppingsMatch ? '+25 pts' : '0 pts'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 font-bold text-[#B45309]">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Speed Bonus ({timeLeft}s remaining):</span>
              </span>
              <span className="tabular-nums">+{scoreData.speedBonus} pts</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-[#D81159] hover:bg-[#B50E49] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Bake Another Order</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
