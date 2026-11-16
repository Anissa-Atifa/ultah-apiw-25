"use client";

import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { IconGamepad, IconPixelHeart, IconSpotifyWave } from "./ArcadeIcons";

// Efek Suara 8-Bit Retro via Web Audio API
function playRetroSound(type = "catch", soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "catch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.06);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === "bonus") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "miss") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(220, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "bug") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(95, now + 0.14);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === "boom") {
      // Suara Ledakan Game Over (3x Kena Bug)
      const notes = [180, 140, 100, 65];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sawtooth";
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.11);
        g.gain.setValueAtTime(0.14, now + idx * 0.11);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.25);
        o.start(now + idx * 0.11);
        o.stop(now + idx * 0.11 + 0.25);
      });
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.09);
        g.gain.setValueAtTime(0.09, now + idx * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
        o.start(now + idx * 0.09);
        o.stop(now + idx * 0.09 + 0.22);
      });
    }
  } catch {
    // Abaikan jika browser memblokir audio otomatis
  }
}

export default function HeartCatcherGame({
  appConfig,
  isAdminUnlocked,
  onOpenPrizeEditor,
  onNavigateStage
}) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speedLevel, setSpeedLevel] = useState(1);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isGameOverBoom, setIsGameOverBoom] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoomPhoto, setZoomPhoto] = useState(null);

  const TARGET_SCORE = 1000;
  const MAX_LIVES = 3;

  // State internal game loop
  const gameRef = useRef({
    playerX: 150,
    playerWidth: 82,
    items: [],
    floatingTexts: [],
    lastSpawn: 0,
    startTime: 0,
    score: 0,
    lives: 3,
    speedLevel: 1,
    running: false,
    moveLeft: false,
    moveRight: false
  });

  // Parse foto hadiah kemenangan dari JSON
  let winPhotos = [];
  try {
    winPhotos = JSON.parse(appConfig?.winPhotosJson || "[]");
  } catch {
    winPhotos = [];
  }

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 380);
  };

  const triggerBoomGameOver = () => {
    setIsPlaying(false);
    setIsGameOverBoom(true);
    triggerShake();
    playRetroSound("boom", soundEnabled);
  };

  const triggerWinCelebration = () => {
    setIsPlaying(false);
    setHasWon(true);
    setShowPrizeModal(true);
    playRetroSound("win", soundEnabled);

    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#00ff66", "#ff007f", "#00f3ff", "#ffffff"]
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 110,
          origin: { y: 0.5 },
          colors: ["#ff007f", "#00ff66", "#00f3ff"]
        });
      }, 400);
    } catch {
      // Fallback aman
    }
  };

  const startGame = () => {
    const now = performance.now();
    gameRef.current = {
      playerX: 155,
      playerWidth: 82,
      items: [],
      floatingTexts: [],
      lastSpawn: now,
      startTime: now,
      score: 0,
      lives: MAX_LIVES,
      speedLevel: 1,
      running: true,
      moveLeft: false,
      moveRight: false
    };
    setScore(0);
    setLives(MAX_LIVES);
    setSpeedLevel(1);
    setElapsedSec(0);
    setIsGameOverBoom(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameRef.current.moveLeft = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameRef.current.moveRight = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        gameRef.current.moveLeft = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        gameRef.current.moveRight = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const addFloatingText = (x, y, text, color) => {
      gameRef.current.floatingTexts.push({
        x,
        y,
        text,
        color,
        alpha: 1,
        vy: -1.4
      });
    };

    const renderLoop = (timestamp) => {
      if (!gameRef.current.running) return;

      const W = canvas.width;
      const H = canvas.height;
      const st = gameRef.current;

      // Hitung detik berjalan & Speed Up setiap 10 detik!
      const totalSeconds = Math.floor((timestamp - st.startTime) / 1000);
      const calculatedSpeedLvl = 1 + Math.floor(totalSeconds / 10);

      if (calculatedSpeedLvl !== st.speedLevel) {
        st.speedLevel = calculatedSpeedLvl;
        setSpeedLevel(calculatedSpeedLvl);
        addFloatingText(
          W / 2,
          H / 2 - 20,
          `⚡ SPEED UP! LEVEL ${calculatedSpeedLvl}`,
          "#00f3ff"
        );
      }
      setElapsedSec(totalSeconds);

      // Kecepatan keranjang Apiw ikut sedikit lebih sigap saat level naik
      const playerStep = 6.6 + Math.min(st.speedLevel * 0.45, 3.5);
      if (st.moveLeft) st.playerX = Math.max(8, st.playerX - playerStep);
      if (st.moveRight) st.playerX = Math.min(W - st.playerWidth - 8, st.playerX + playerStep);

      // Interval spawn makin rapat seiring Speed Level bertambah
      const spawnInterval = Math.max(270, 560 - (st.speedLevel - 1) * 52);
      const speedMultiplier = 1 + (st.speedLevel - 1) * 0.28;

      if (timestamp - st.lastSpawn > spawnInterval) {
        const roll = Math.random();
        let itemType = "heart"; // Default: Hati Pink (+20 Poin)
        if (roll < 0.27) {
          itemType = "bug"; // Kena 1x = -1 Nyawa, Kena 3x = BOOM U DEAD
        } else if (roll > 0.88) {
          itemType = "superHeart"; // Hati Spesial Cyan (+50 Poin)
        }

        st.items.push({
          x: 26 + Math.random() * (W - 52),
          y: -22,
          speed: (2.4 + Math.random() * 1.5) * speedMultiplier,
          type: itemType
        });
        st.lastSpawn = timestamp;
      }

      // Bersihkan latar canvas
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);

      // Garis grid tipis di dalam arena
      ctx.strokeStyle = "rgba(0, 243, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Info HUD kecil di dalam Canvas atas
      ctx.fillStyle = "rgba(18, 19, 26, 0.88)";
      ctx.fillRect(0, 0, W, 30);
      ctx.fillStyle = "#00ff66";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`PTS: ${st.score}/${TARGET_SCORE}`, 10, 19);

      ctx.fillStyle = "#00f3ff";
      ctx.textAlign = "center";
      ctx.fillText(`SPEED LVL ${st.speedLevel} (${totalSeconds}s)`, W / 2, 19);

      ctx.fillStyle = "#ff007f";
      ctx.textAlign = "right";
      ctx.fillText(`LIVES: ${"♥".repeat(st.lives)}${"♡".repeat(MAX_LIVES - st.lives)}`, W - 10, 19);

      // Gambar keranjang penangkap (PLAYER 1: APIW)
      const catcherY = H - 38;
      ctx.fillStyle = "#00ff66";
      ctx.shadowColor = "#00ff66";
      ctx.shadowBlur = 12;
      ctx.fillRect(st.playerX, catcherY, st.playerWidth, 15);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#0a0a0c";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("APIW LV.25", st.playerX + st.playerWidth / 2, catcherY + 11);

      // Update & gambar item jatuh
      const remaining = [];
      for (const item of st.items) {
        item.y += item.speed;

        // Cek tabrakan dengan keranjang Apiw
        const hitY = item.y >= catcherY - 12 && item.y <= catcherY + 18;
        const hitX = item.x >= st.playerX - 12 && item.x <= st.playerX + st.playerWidth + 12;

        if (hitX && hitY) {
          if (item.type === "heart" || item.type === "superHeart") {
            const addPts = item.type === "superHeart" ? 50 : 20;
            st.score += addPts;
            setScore(st.score);
            addFloatingText(
              item.x,
              catcherY - 10,
              `+${addPts}`,
              item.type === "superHeart" ? "#00f3ff" : "#00ff66"
            );
            playRetroSound(item.type === "superHeart" ? "bonus" : "catch", soundEnabled);

            if (st.score >= TARGET_SCORE) {
              st.running = false;
              triggerWinCelebration();
              return;
            }
          } else if (item.type === "bug") {
            st.lives = Math.max(0, st.lives - 1);
            setLives(st.lives);
            triggerShake();
            addFloatingText(item.x, catcherY - 12, "💥 BOOM! -1 NYAWA", "#f43f5e");

            if (st.lives <= 0) {
              st.running = false;
              triggerBoomGameOver();
              return;
            } else {
              playRetroSound("bug", soundEnabled);
            }
          }
          continue;
        }

        // Cek jika item lewat batas bawah layar (Tidak tertangkap!)
        if (item.y >= H + 12) {
          if (item.type === "heart" || item.type === "superHeart") {
            // Penalti melewatkan hati: -5 Poin!
            st.score = Math.max(0, st.score - 5);
            setScore(st.score);
            addFloatingText(
              Math.min(Math.max(item.x, 35), W - 35),
              H - 16,
              "LEWAT! -5",
              "#fbbf24"
            );
            playRetroSound("miss", soundEnabled);
          }
          continue;
        }

        remaining.push(item);

        // Gambar visual item
        if (item.type === "heart") {
          // Hati Pink (+20)
          ctx.fillStyle = "#ff007f";
          ctx.shadowColor = "#ff007f";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(item.x - 5, item.y, 6, 0, Math.PI * 2);
          ctx.arc(item.x + 5, item.y, 6, 0, Math.PI * 2);
          ctx.moveTo(item.x - 11, item.y + 2);
          ctx.lineTo(item.x, item.y + 14);
          ctx.lineTo(item.x + 11, item.y + 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (item.type === "superHeart") {
          // Hati Spesial Cyan (+50)
          ctx.fillStyle = "#00f3ff";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(item.x - 6, item.y, 7, 0, Math.PI * 2);
          ctx.arc(item.x + 6, item.y, 7, 0, Math.PI * 2);
          ctx.moveTo(item.x - 13, item.y + 2);
          ctx.lineTo(item.x, item.y + 16);
          ctx.lineTo(item.x + 13, item.y + 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("+50", item.x, item.y - 10);
        } else {
          // System Bug / Bom Merah (Kena 3x = BOOM U DEAD)
          ctx.fillStyle = "#f43f5e";
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(item.x, item.y + 2, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("BUG", item.x, item.y + 5);
        }
      }
      st.items = remaining;

      // Gambar teks melayang (+20, -5, SPEED UP, BOOM)
      const nextFloating = [];
      for (const ft of st.floatingTexts) {
        ft.y += ft.vy;
        ft.alpha -= 0.025;
        if (ft.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, ft.alpha);
          ctx.fillStyle = ft.color;
          ctx.font = "bold 12px monospace";
          ctx.textAlign = "center";
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
          nextFloating.push(ft);
        }
      }
      st.floatingTexts = nextFloating;

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying, soundEnabled]);

  // Geser keranjang langsung dengan sentuhan jari / mouse di atas canvas
  const handlePointerMove = (e) => {
    if (!isPlaying || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relX = ((clientX - rect.left) / rect.width) * canvasRef.current.width;
    const w = gameRef.current.playerWidth;
    gameRef.current.playerX = Math.max(
      8,
      Math.min(canvasRef.current.width - w - 8, relX - w / 2)
    );
  };

  const progressPercent = Math.min(100, Math.round((score / TARGET_SCORE) * 100));

  return (
    <div className="space-y-6">
      {/* Header Stage 3 */}
      <div className="bg-panel/90 border border-hotPink/40 rounded-2xl p-5 sm:p-6 shadow-hotPink">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-terminal uppercase tracking-wider bg-hotPink/15 text-hotPink border border-hotPink/40">
              <IconGamepad className="w-4 h-4" />
              STAGE 03 // CHALLENGE MINI-GAME (1000 PTS)
            </span>
            <h2 className="font-pixel text-base sm:text-xl text-white mt-2">
              MISI 1.000 POIN CINTA — JANGAN KENA BUG 3X!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 leading-relaxed">
              • Tangkap <span className="text-hotPink font-semibold">Hati Pink (+20 Poin)</span> &amp;{" "}
              <span className="text-cyberCyan font-semibold">Hati Biru (+50 Poin)</span> hingga{" "}
              <strong className="text-neonGreen">1.000 Poin</strong>!<br />• Hati yang lewat gak
              ketangkap mengurangi <span className="text-amber-400 font-semibold">-5 Poin</span>.
              Tiap <strong>10 detik</strong> kecepatan makin ngebut!<br />• Awas! Kena{" "}
              <span className="text-rose-400 font-semibold">[BUG]</span> mengurangi 1 Nyawa. Kalau
              kena <strong>3x langsung BOOM MELEDAK!</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="arcade-btn px-3 py-2 rounded-xl border border-cyberCyan/40 bg-void text-xs font-terminal text-cyberCyan hover:bg-cyberCyan/10"
            >
              {soundEnabled ? "SFX: ON" : "SFX: MUTE"}
            </button>

            {hasWon && (
              <button
                type="button"
                onClick={() => setShowPrizeModal(true)}
                className="arcade-btn px-4 py-2 rounded-xl bg-hotPink text-white text-xs font-pixel shadow-hotPink"
              >
                BUKA HADIAH LAGI
              </button>
            )}

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={onOpenPrizeEditor}
                className="arcade-btn px-3 py-2 rounded-xl bg-neonGreen/15 border border-neonGreen text-neonGreen text-xs font-terminal"
              >
                + Edit Hadiah &amp; Barcode Spotify (PIN)
              </button>
            )}
          </div>
        </div>

        {/* Bar Skor, Progress Bar 1000 Poin, Kecepatan & 3 Nyawa */}
        <div className="mt-5 space-y-2.5 bg-void/90 border border-zinc-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-pixel text-xs sm:text-sm text-neonGreen tabular-nums">
                SCORE: {score} / {TARGET_SCORE}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyberCyan/15 border border-cyberCyan/40 font-terminal text-xs text-cyberCyan tabular-nums">
                ⚡ SPEED LVL {speedLevel} ({elapsedSec}s)
              </span>
            </div>

            {/* Indikator 3 Nyawa */}
            <div className="flex items-center gap-1.5">
              <span className="font-terminal text-xs text-zinc-400 mr-1">NYAWA:</span>
              {[...Array(MAX_LIVES)].map((_, idx) => (
                <IconPixelHeart
                  key={idx}
                  className={`w-5 h-5 transition-all ${
                    idx < lives ? "text-hotPink scale-110" : "text-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar Menuju 1000 Poin */}
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-neonGreen via-cyberCyan to-hotPink transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Arena Canvas Game */}
        <div className="mt-4 relative flex flex-col items-center">
          <div
            className={`relative w-full max-w-[440px] rounded-2xl overflow-hidden border-2 transition-transform ${
              screenShake
                ? "border-rose-500 translate-x-1 -translate-y-1 shadow-[0_0_30px_rgba(244,63,94,0.8)]"
                : "border-cyberCyan/50 shadow-cyberCyan"
            } bg-void`}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={370}
              onMouseMove={handlePointerMove}
              onTouchMove={handlePointerMove}
              className="w-full h-auto block touch-none cursor-pointer"
            />

            {/* LAYAR MELEDAK BOOM SAAT KENA BUG 3X (GAME OVER) */}
            {!isPlaying && isGameOverBoom && (
              <div className="absolute inset-0 bg-gradient-to-b from-rose-950/95 via-black/95 to-rose-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center mb-3 animate-bounce shadow-[0_0_35px_rgba(244,63,94,0.9)]">
                  <span className="font-pixel text-2xl text-rose-400">💥</span>
                </div>

                <h3 className="font-pixel text-lg sm:text-xl text-rose-500 tracking-wider drop-shadow">
                  BOOM!! U DEAD!
                </h3>

                <div className="mt-3 px-4 py-3 rounded-2xl bg-rose-500/20 border-2 border-rose-500 shadow-lg">
                  <p className="font-pixel text-xs sm:text-sm text-white leading-relaxed">
                    &quot;Kamu ga sayang akuuu :&apos;( &quot;
                  </p>
                </div>

                <p className="text-xs text-rose-200/90 mt-3 max-w-xs">
                  Yah! Kamu kena BUG 3 kali sampai nyawanya habis di skor{" "}
                  <strong className="text-neonGreen">{score} Poin</strong>. Ayo buktiin kalau kamu
                  sayang aku sampai tembus 1.000 poin!
                </p>

                <button
                  type="button"
                  onClick={startGame}
                  className="arcade-btn mt-5 px-6 py-3.5 rounded-xl bg-hotPink text-white font-pixel text-xs shadow-hotPink hover:bg-rose-500"
                >
                  ▶ COBA LAGI (BUKTIKAN SAYANG AKU!)
                </button>
              </div>
            )}

            {/* Layar Start Normal / Menang */}
            {!isPlaying && !isGameOverBoom && (
              <div className="absolute inset-0 bg-void/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <IconPixelHeart className="w-12 h-12 text-hotPink animate-bounce mb-3" />
                <p className="font-pixel text-xs sm:text-sm text-neonGreen mb-2">
                  {hasWon
                    ? "1.000 PTS CLEARED! LEVEL 25 CHAMPION <3"
                    : "READY PLAYER 1 (APIW)? TARGET: 1.000 POIN"}
                </p>
                <p className="text-xs text-zinc-300 max-w-xs mb-5 leading-relaxed">
                  Tangkap Hati Pink (+20) &amp; Biru (+50). Jangan lewatkan hati (-5) dan jangan
                  kena BUG 3x! Tiap 10 detik makin cepat!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={startGame}
                    className="arcade-btn px-5 py-3 rounded-xl bg-neonGreen text-void font-pixel text-xs shadow-neonGreen"
                  >
                    {hasWon ? "MAIN LAGI" : "START MINI-GAME"}
                  </button>
                  {hasWon && (
                    <button
                      type="button"
                      onClick={() => setShowPrizeModal(true)}
                      className="arcade-btn px-5 py-3 rounded-xl bg-hotPink text-white font-pixel text-xs shadow-hotPink"
                    >
                      LIHAT SURAT &amp; SPOTIFY
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tombol Kontrol Ramah Jempol HP */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[440px] mt-4">
            <button
              type="button"
              onMouseDown={() => {
                gameRef.current.moveLeft = true;
              }}
              onMouseUp={() => {
                gameRef.current.moveLeft = false;
              }}
              onMouseLeave={() => {
                gameRef.current.moveLeft = false;
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                gameRef.current.moveLeft = true;
              }}
              onTouchEnd={() => {
                gameRef.current.moveLeft = false;
              }}
              className="arcade-btn py-3.5 rounded-xl bg-panel border border-cyberCyan/50 text-cyberCyan font-pixel text-xs active:bg-cyberCyan active:text-void select-none"
            >
              ◀ GESER KIRI
            </button>
            <button
              type="button"
              onMouseDown={() => {
                gameRef.current.moveRight = true;
              }}
              onMouseUp={() => {
                gameRef.current.moveRight = false;
              }}
              onMouseLeave={() => {
                gameRef.current.moveRight = false;
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                gameRef.current.moveRight = true;
              }}
              onTouchEnd={() => {
                gameRef.current.moveRight = false;
              }}
              className="arcade-btn py-3.5 rounded-xl bg-panel border border-cyberCyan/50 text-cyberCyan font-pixel text-xs active:bg-cyberCyan active:text-void select-none"
            >
              GESER KANAN ▶
            </button>
          </div>
        </div>
      </div>

      {/* MODAL HADIAH KEMENANGAN: SURAT CINTA + FOTO BERDUA + BARCODE SPOTIFY */}
      {showPrizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-panel border-2 border-hotPink rounded-2xl p-5 sm:p-7 shadow-hotPink my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <IconPixelHeart className="w-6 h-6 text-hotPink" />
                <span className="font-pixel text-xs sm:text-sm text-neonGreen">
                  1.000 PTS UNLOCKED // SECRET PRIZE!
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPrizeModal(false)}
                className="arcade-btn px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-terminal hover:bg-rose-600 hover:text-white"
              >
                TUTUP [X]
              </button>
            </div>

            {/* 1. Pesan Cinta Kustom Sesuai Permintaan */}
            <div className="mt-5 bg-void/90 border border-hotPink/40 rounded-2xl p-5">
              <p className="text-sm sm:text-base text-zinc-100 leading-relaxed whitespace-pre-line font-medium">
                {appConfig?.winMessage}
              </p>
            </div>

            {/* 2. Beberapa Foto Kita Berdua */}
            {winPhotos.length > 0 && (
              <div className="mt-6">
                <h4 className="font-pixel text-xs text-cyberCyan mb-3 uppercase">
                  OUR FAVORITE MOMENTS TOGETHER &lt;3
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {winPhotos.map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => setZoomPhoto(photo)}
                      className="arcade-card cursor-pointer bg-void border border-cyberCyan/30 rounded-xl overflow-hidden group"
                    >
                      <div className="aspect-video w-full bg-zinc-900 overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title || `Foto Kita ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-terminal text-base text-neonGreen">{photo.title}</p>
                        {photo.caption && (
                          <p className="text-xs text-zinc-300 mt-0.5">{photo.caption}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Kartu Barcode Spotify yang Bisa Di-Scan Apiw */}
            <div className="mt-6 bg-void border-2 border-neonGreen/60 rounded-2xl p-4 sm:p-5 text-center shadow-neonGreen">
              <div className="inline-flex items-center gap-2 text-neonGreen font-pixel text-xs mb-2">
                <IconSpotifyWave className="w-5 h-5" />
                <span>SCAN BARCODE SPOTIFY INI YA BABEE!</span>
              </div>
              <p className="text-xs text-zinc-300 mb-3">
                Buka aplikasi <strong>Spotify</strong> di HP kamu &rarr; ketuk menu{" "}
                <strong>Search (Cari)</strong> &rarr; ketuk ikon <strong>Kamera</strong> di pojok
                kanan atas &rarr; arahkan ke barcode di bawah ini:
              </p>
              <div className="bg-panel p-3 rounded-xl border border-zinc-800 inline-block max-w-full">
                <img
                  src={appConfig?.spotifyBarcodeUrl}
                  alt="Spotify Barcode untuk Apiw"
                  className="max-h-40 w-auto mx-auto rounded-lg object-contain"
                />
              </div>
            </div>

            {/* Tombol Lanjut ke Undangan Ngedate Hari Kamis di Blok M */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    setShowPrizeModal(false);
                    onOpenPrizeEditor();
                  }}
                  className="arcade-btn px-4 py-2.5 rounded-xl border border-cyberCyan text-cyberCyan text-xs font-terminal"
                >
                  Ubah Foto Hadiah / Upload Barcode Spotify
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowPrizeModal(false);
                  onNavigateStage("date");
                }}
                className="arcade-btn ml-auto px-5 py-3 rounded-xl bg-neonGreen text-void font-pixel text-xs shadow-neonGreen"
              >
                LANJUT: BUKA UNDANGAN DATE KAMIS ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Perbesar Foto Hadiah */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-lg w-full bg-panel border border-cyberCyan rounded-2xl overflow-hidden p-3">
            <img
              src={zoomPhoto.imageUrl}
              alt={zoomPhoto.title}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <p className="text-center font-terminal text-lg text-neonGreen mt-2">
              {zoomPhoto.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
