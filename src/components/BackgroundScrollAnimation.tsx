import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 300;

export const BackgroundScrollAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingStatusRef = useRef<('idle' | 'loading' | 'loaded' | 'error')[]>(new Array(TOTAL_FRAMES).fill('idle'));
  const loadedSetRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animationFrameIdRef = useRef<number | null>(null);
  const [loadPercentage, setLoadPercentage] = useState<number>(0);

  // Pad index to 3 digits: e.g. 1 -> 001, 45 -> 045, 300 -> 300
  const getFrameUrl = (index: number) => {
    const padded = String(index).padStart(3, '0');
    return `/frames/ezgif-frame-${padded}.jpg`;
  };

  // Draw frame with object-fit: cover scaling directly without clearRect flashes
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false instructs GPU to optimize opaque drawing
    if (!ctx) return;

    // Use requested frame or fallback to closest loaded frame
    let img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestDist = Infinity;
      let closestIdx = -1;
      loadedSetRef.current.forEach((idx) => {
        const dist = Math.abs(idx - frameIndex);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      if (closestIdx !== -1) {
        img = imagesRef.current[closestIdx - 1];
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth = canvasWidth;
    let renderHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - renderWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Draw directly over canvas — no clearRect needed since cover fills 100% of the surface
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  // Adjust canvas resolution dynamically on resize (capped at 1.75 DPR for optimal mobile & desktop 60fps)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    drawFrame(Math.round(currentFrameRef.current));
  }, [drawFrame]);

  // Load a single frame with off-thread decoding
  const loadSingleFrame = useCallback((index: number) => {
    if (index < 1 || index > TOTAL_FRAMES) return;
    if (loadingStatusRef.current[index - 1] !== 'idle') return;

    loadingStatusRef.current[index - 1] = 'loading';
    const image = new Image();
    image.src = getFrameUrl(index);

    const onFinish = () => {
      imagesRef.current[index - 1] = image;
      loadingStatusRef.current[index - 1] = 'loaded';
      loadedSetRef.current.add(index);
      
      const count = loadedSetRef.current.size;
      if (count % 15 === 0 || count === TOTAL_FRAMES) {
        setLoadPercentage(Math.round((count / TOTAL_FRAMES) * 100));
      }

      // If current frame is close or matches, repaint
      if (Math.abs(Math.round(currentFrameRef.current) - index) <= 1) {
        drawFrame(Math.round(currentFrameRef.current));
      }
    };

    image.onload = () => {
      if ('decode' in image) {
        image.decode().then(onFinish).catch(onFinish);
      } else {
        onFinish();
      }
    };

    image.onerror = () => {
      loadingStatusRef.current[index - 1] = 'error';
    };
  }, [drawFrame]);

  // Priority load window around target scroll position
  const prioritizeProximityFrames = useCallback((targetFrame: number) => {
    const center = Math.round(targetFrame);
    // Load 20 frames ahead and 10 frames behind immediately
    for (let offset = 0; offset <= 20; offset++) {
      const forward = center + offset;
      const backward = center - offset;
      if (forward <= TOTAL_FRAMES) loadSingleFrame(forward);
      if (backward >= 1) loadSingleFrame(backward);
    }
  }, [loadSingleFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // 1. Immediately load frame 1 for instant first paint
    loadSingleFrame(1);

    // 2. Pre-fetch a sampled grid of keyframes across the 300 frames (every 5th frame)
    for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
      loadSingleFrame(i);
    }

    // 3. Priority load initial 40 frames sequentially
    for (let i = 2; i <= 40; i++) {
      loadSingleFrame(i);
    }

    // 4. Progressively background-load remaining frames in fast staged chunks
    let currentBatchStart = 41;
    const batchSize = 30;
    const intervalTimer = setInterval(() => {
      if (currentBatchStart > TOTAL_FRAMES) {
        clearInterval(intervalTimer);
        return;
      }
      for (let i = currentBatchStart; i < Math.min(TOTAL_FRAMES + 1, currentBatchStart + batchSize); i++) {
        loadSingleFrame(i);
      }
      currentBatchStart += batchSize;
    }, 60);

    return () => {
      clearInterval(intervalTimer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas, loadSingleFrame]);

  // Scroll listener & smooth lerp animation loop
  useEffect(() => {
    const updateTargetFrameFromScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalScrollable = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.max(0, Math.min(1, scrollY / totalScrollable));
      const target = 1 + progress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = target;
      prioritizeProximityFrames(target);
    };

    window.addEventListener('scroll', updateTargetFrameFromScroll, { passive: true });
    updateTargetFrameFromScroll();

    let lastRenderedFrame = -1;

    // Render loop with lerp physics for silky smooth momentum
    const renderLoop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.005) {
        // 0.18 damping factor provides snappy organic responsiveness
        currentFrameRef.current += delta * 0.18;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastRenderedFrame) {
        drawFrame(frameToDraw);
        lastRenderedFrame = frameToDraw;
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', updateTargetFrameFromScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawFrame, prioritizeProximityFrames]);

  return (
    <div 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden transform-gpu" 
      aria-hidden="true"
    >
      {/* High performance hardware-accelerated canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transform-gpu will-change-transform"
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Atmospheric dark contrast vignette so foreground text and elements are crystal clear */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none" />

      {/* Subtle radial warmth glow in center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,154,99,0.12),transparent_70%)] pointer-events-none" />

      {/* Discrete subtle frame badge */}
      <div className="fixed bottom-4 left-4 z-20 pointer-events-auto hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-[10px] text-[#c9a78e] font-mono shadow-xl transition-opacity duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d59a63] animate-ping" />
        <span>Frame {Math.round(currentFrameRef.current)} / {TOTAL_FRAMES}</span>
        {loadPercentage < 100 && (
          <span className="text-[#8e7667]">({loadPercentage}% loaded)</span>
        )}
      </div>
    </div>
  );
};
