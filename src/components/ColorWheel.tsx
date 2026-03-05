'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  hexToRgb,
  getAngleFromPoint,
  getDistanceFromCenter,
  getColorRecommendations,
  type ColorRecommendation
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Check } from 'lucide-react';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onColorsChange: (color1: string, color2: string) => void;
  mode?: 'free' | 'recommended';
  onModeChange?: (mode: 'free' | 'recommended') => void;
}

export function ColorWheel({
  color1,
  color2,
  onColorsChange,
  mode = 'free',
  onModeChange
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor1, setSelectedColor1] = useState(color1);
  const [selectedColor2, setSelectedColor2] = useState(color2);
  const [activeSelector, setActiveSelector] = useState<'color1' | 'color2'>('color1');
  const [recommendations, setRecommendations] = useState<ColorRecommendation[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const wheelSize = 240;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = wheelSize / 2 - 10;

  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let y = 0; y < wheelSize; y++) {
      for (let x = 0; x < wheelSize; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          const saturation = (distance / radius) * 100;
          const lightness = 50;

          const rgb = hslToRgb(angle, saturation, lightness);
          ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, []);

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  useEffect(() => {
    if (mode === 'recommended') {
      const recs = getColorRecommendations(selectedColor1);
      setRecommendations(recs);
      if (recs.length > 0 && recs[0].colors.length > 0) {
        const recommendedColor = recs[0].colors[0];
        setSelectedColor2(recommendedColor);
      }
    }
  }, [selectedColor1, mode]);

  useEffect(() => {
    if (selectedColor1 !== color1 || selectedColor2 !== color2) {
      onColorsChange(selectedColor1, selectedColor2);
    }
  }, [selectedColor1, selectedColor2, color1, color2, onColorsChange]);

  useEffect(() => {
    setSelectedColor1(color1);
    setSelectedColor2(color2);
  }, [color1, color2]);

  const getColorFromPosition = (x: number, y: number) => {
    const angle = getAngleFromPoint(x, y, centerX, centerY);
    const distance = getDistanceFromCenter(x, y, centerX, centerY);
    const clampedDistance = Math.min(distance, radius);
    const saturation = (clampedDistance / radius) * 100;
    const lightness = 50;
    const rgb = hslToRgb(angle, saturation, lightness);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  };

  const getPositionFromColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const angle = (hsl.h * Math.PI) / 180;
    const distance = (hsl.s / 100) * radius;
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleCanvasInteraction(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleCanvasInteraction(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseLeave = () => {
    setIsDragging(false);
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getColorFromPosition(x, y);

    if (mode === 'free') {
      if (activeSelector === 'color1') {
        setSelectedColor1(color);
      } else {
        setSelectedColor2(color);
      }
    } else {
      setSelectedColor1(color);
      const recs = getColorRecommendations(color);
      setRecommendations(recs);
      if (recs.length > 0 && recs[0].colors.length > 0) {
        setSelectedColor2(recs[0].colors[0]);
      }
    }
  };

  const selectRecommendation = (color: string) => {
    setSelectedColor2(color);
  };

  const pos1 = getPositionFromColor(selectedColor1);
  const pos2 = getPositionFromColor(selectedColor2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Color Selection</h3>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={mode === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange?.('free')}
            className="text-xs"
          >
            Free
          </Button>
          <Button
            variant={mode === 'recommended' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange?.('recommended')}
            className="text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Recommended
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            className="rounded-full cursor-crosshair border-2 border-border shadow-lg"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseLeave}
          />

          <div
            className="absolute w-6 h-6 rounded-full border-3 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: pos1.x,
              top: pos1.y,
              backgroundColor: selectedColor1,
              boxShadow: `0 0 0 2px white, 0 0 0 4px ${selectedColor1}`
            }}
          />

          <div
            className="absolute w-6 h-6 rounded-full border-3 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: pos2.x,
              top: pos2.y,
              backgroundColor: selectedColor2,
              boxShadow: `0 0 0 2px white, 0 0 0 4px ${selectedColor2}`
            }}
          />
        </div>

        <div className="flex-1 space-y-4">
          {mode === 'free' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl border-2 cursor-pointer transition-all ${activeSelector === 'color1' ? 'border-primary shadow-md scale-105' : 'border-border'}`}
                  style={{ backgroundColor: selectedColor1 }}
                  onClick={() => setActiveSelector('color1')}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Color 1</p>
                  <p className="text-xs font-mono text-muted-foreground">{selectedColor1.toUpperCase()}</p>
                </div>
                <input
                  type="color"
                  value={selectedColor1}
                  onChange={(e) => {
                    setSelectedColor1(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl border-2 cursor-pointer transition-all ${activeSelector === 'color2' ? 'border-primary shadow-md scale-105' : 'border-border'}`}
                  style={{ backgroundColor: selectedColor2 }}
                  onClick={() => setActiveSelector('color2')}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Color 2</p>
                  <p className="text-xs font-mono text-muted-foreground">{selectedColor2.toUpperCase()}</p>
                </div>
                <input
                  type="color"
                  value={selectedColor2}
                  onChange={(e) => {
                    setSelectedColor2(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
              </div>
            </div>
          )}

          {mode === 'recommended' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-primary shadow-md"
                  style={{ backgroundColor: selectedColor1 }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Selected Color</p>
                  <p className="text-xs font-mono text-muted-foreground">{selectedColor1.toUpperCase()}</p>
                </div>
                <input
                  type="color"
                  value={selectedColor1}
                  onChange={(e) => {
                    setSelectedColor1(e.target.value);
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Recommended Combinations:</p>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">{rec.name}</p>
                    <div className="flex gap-2">
                      {rec.colors.map((color, colorIdx) => (
                        <button
                          key={colorIdx}
                          onClick={() => selectRecommendation(color)}
                          className={`relative w-12 h-12 rounded-xl border-2 transition-all hover:scale-105 ${selectedColor2 === color ? 'border-primary shadow-md' : 'border-border'}`}
                          style={{ backgroundColor: color }}
                          title={color.toUpperCase()}
                        >
                          {selectedColor2 === color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div
                className="w-16 h-12 rounded-lg"
                style={{ background: `linear-gradient(135deg, ${selectedColor1}, ${selectedColor2})` }}
              />
              <div className="flex-1">
                <p className="text-xs font-medium">Preview</p>
                <p className="text-[10px] text-muted-foreground font-mono">{selectedColor1} → {selectedColor2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
