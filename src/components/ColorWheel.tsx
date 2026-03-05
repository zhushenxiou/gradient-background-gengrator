'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { hexToHsl, hslToHex, getHslFromWheelPosition, getWheelPosition, generateHarmonyColors, harmonySchemes, type HarmonyType } from '@/lib/colorUtils';
import { Palette, Sparkles, MousePointer, Lightbulb, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorWheelProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
  className?: string;
}

type SelectionMode = 'free' | 'recommend';
type ActiveColorIndex = 0 | 1;

const WHEEL_SIZE = 280;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const CENTER = WHEEL_RADIUS;

export function ColorWheel({ colors, onColorsChange, className }: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('complementary');
  const [baseColor, setBaseColor] = useState<string>(colors[0] || '#5135FF');
  const [secondColor, setSecondColor] = useState<string>(colors[1] || '#FF5828');
  const [activeColorIndex, setActiveColorIndex] = useState<ActiveColorIndex>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lightness, setLightness] = useState(50);
  const wheelRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // 获取当前活跃的颜色
  const activeColor = activeColorIndex === 0 ? baseColor : secondColor;
  const setActiveColor = activeColorIndex === 0 ? setBaseColor : setSecondColor;

  // 同步外部 colors 到内部状态（仅在初始加载时）
  useEffect(() => {
    if (colors.length > 0 && !isUpdatingRef.current) {
      if (colors[0] !== baseColor) {
        setBaseColor(colors[0]);
      }
      if (colors[1] && colors[1] !== secondColor) {
        setSecondColor(colors[1]);
      }
    }
  }, []); // 只在挂载时执行

  // 当基础颜色或推荐模式改变时，更新颜色方案
  useEffect(() => {
    if (mode === 'recommend' && !isDragging) {
      isUpdatingRef.current = true;
      const harmonyColors = generateHarmonyColors(baseColor, selectedHarmony);
      const newColors = [baseColor, ...harmonyColors.slice(1, 4)];
      onColorsChange(newColors);
      if (newColors[1]) {
        setSecondColor(newColors[1]);
      }
      // 使用 setTimeout 重置标志，避免立即触发其他 effect
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [baseColor, selectedHarmony, mode, isDragging]);

  // 自由模式下，当颜色改变时更新
  useEffect(() => {
    if (mode === 'free' && !isDragging && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      const newColors = [baseColor];
      if (secondColor) newColors.push(secondColor);
      onColorsChange(newColors);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [baseColor, secondColor, mode, isDragging]);

  // 获取颜色在色轮上的位置
  const baseHsl = hexToHsl(activeColor);
  const activePosition = getWheelPosition(baseHsl.h, baseHsl.s, WHEEL_RADIUS - 8);

  // 获取第二种颜色的位置（用于显示）
  const secondHsl = hexToHsl(secondColor || baseColor);
  const secondPosition = getWheelPosition(secondHsl.h, secondHsl.s, WHEEL_RADIUS - 8);

  // 处理色轮点击/拖动
  const handleWheelInteraction = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 检查是否在色轮范围内
    const dx = x - CENTER;
    const dy = y - CENTER;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > WHEEL_RADIUS) return; // 在色轮外，不处理

    const hsl = getHslFromWheelPosition(x, y, WHEEL_RADIUS);
    const newColor = hslToHex(hsl.h, hsl.s, lightness);

    setActiveColor(newColor);
  }, [lightness, setActiveColor]);

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleWheelInteraction(e.clientX, e.clientY);
    }
  }, [isDragging, handleWheelInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    handleWheelInteraction(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleWheelInteraction(touch.clientX, touch.clientY);
    }
  }, [isDragging, handleWheelInteraction]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // 生成色轮的 conic gradient
  const wheelGradient = `conic-gradient(
    from 0deg,
    hsl(0, 100%, 50%),
    hsl(30, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(90, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(150, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(210, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(270, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(330, 100%, 50%),
    hsl(360, 100%, 50%)
  )`;

  // 获取推荐模式下的预览颜色
  const previewColors = mode === 'recommend'
    ? generateHarmonyColors(baseColor, selectedHarmony)
    : [baseColor, secondColor].filter(Boolean);

  // 处理亮度变化
  const handleLightnessChange = (newLightness: number) => {
    setLightness(newLightness);
    const currentHsl = hexToHsl(activeColor);
    const newColor = hslToHex(currentHsl.h, currentHsl.s, newLightness);
    setActiveColor(newColor);
  };

  // 切换模式时重置状态
  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);
    setIsDragging(false);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 模式选择 */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        <Button
          variant={mode === 'free' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('free')}
          className="flex-1 gap-2"
        >
          <MousePointer className="w-4 h-4" />
          自由选择
        </Button>
        <Button
          variant={mode === 'recommend' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleModeChange('recommend')}
          className="flex-1 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          推荐选择
        </Button>
      </div>

      {/* 色轮容器 */}
      <div className="flex flex-col items-center gap-6">
        {/* 自由模式：颜色选择器 */}
        {mode === 'free' && (
          <div className="flex items-center gap-4 w-full justify-center">
            <button
              onClick={() => setActiveColorIndex(0)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all",
                activeColorIndex === 0
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className="w-6 h-6 rounded-full border border-border"
                style={{ backgroundColor: baseColor }}
              />
              <span className="text-sm font-medium">颜色 1</span>
            </button>
            <button
              onClick={() => setActiveColorIndex(1)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all",
                activeColorIndex === 1
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div
                className="w-6 h-6 rounded-full border border-border"
                style={{ backgroundColor: secondColor }}
              />
              <span className="text-sm font-medium">颜色 2</span>
            </button>
          </div>
        )}

        {/* 色轮 */}
        <div
          ref={wheelRef}
          className="relative rounded-full cursor-crosshair select-none touch-none"
          style={{
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            background: wheelGradient,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* 饱和度遮罩 */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, white 0%, transparent 70%)`,
            }}
          />

          {/* 中心白色圆 */}
          <div
            className="absolute rounded-full bg-white shadow-md border-2 border-gray-200"
            style={{
              width: 24,
              height: 24,
              left: CENTER - 12,
              top: CENTER - 12,
            }}
          />

          {/* 活跃颜色指示器 */}
          <div
            className="absolute w-6 h-6 rounded-full border-3 border-white shadow-lg pointer-events-none transition-transform duration-75 z-10"
            style={{
              backgroundColor: activeColor,
              left: activePosition.x - 12,
              top: activePosition.y - 12,
              boxShadow: `0 0 0 3px ${activeColor}60, 0 0 0 6px white`,
              transform: isDragging ? 'scale(1.2)' : 'scale(1)',
            }}
          />

          {/* 第二种颜色指示器（仅在自由模式显示） */}
          {mode === 'free' && activeColorIndex !== 1 && (
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none opacity-60"
              style={{
                backgroundColor: secondColor,
                left: secondPosition.x - 10,
                top: secondPosition.y - 10,
              }}
            />
          )}

          {/* 推荐模式下的辅助指示点 */}
          {mode === 'recommend' && previewColors.slice(1).map((color, index) => {
            const hsl = hexToHsl(color);
            const pos = getWheelPosition(hsl.h, hsl.s, WHEEL_RADIUS - 8);
            return (
              <div
                key={index}
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
                style={{
                  backgroundColor: color,
                  left: pos.x - 8,
                  top: pos.y - 8,
                  opacity: 0.8,
                }}
              />
            );
          })}
        </div>

        {/* 亮度调节 */}
        <div className="w-full max-w-[280px] space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>亮度</span>
            <span>{lightness}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="85"
            value={lightness}
            onChange={(e) => handleLightnessChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, ${hslToHex(baseHsl.h, baseHsl.s, 15)}, ${hslToHex(baseHsl.h, baseHsl.s, 50)}, ${hslToHex(baseHsl.h, baseHsl.s, 85)})`
            }}
          />
        </div>

        {/* 当前选中颜色显示 */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-2 border-border shadow-sm"
            style={{ backgroundColor: activeColor }}
          />
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {mode === 'free' ? `颜色 ${activeColorIndex + 1}` : '当前颜色'}
            </div>
            <div className="font-mono text-lg font-semibold">{activeColor.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">
              HSL({baseHsl.h}°, {baseHsl.s}%, {lightness}%)
            </div>
          </div>
        </div>

        {/* 推荐模式：色彩和谐方案选择 */}
        {mode === 'recommend' && (
          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="w-4 h-4 text-primary" />
              选择配色方案
            </div>
            <div className="grid grid-cols-2 gap-2">
              {harmonySchemes.map((scheme) => (
                <button
                  key={scheme.type}
                  onClick={() => setSelectedHarmony(scheme.type)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    selectedHarmony === scheme.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <div className="font-medium text-sm">{scheme.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{scheme.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 颜色预览 */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Palette className="w-4 h-4 text-primary" />
              {mode === 'recommend' ? '推荐配色' : '当前配色'}
            </div>
            <span className="text-xs text-muted-foreground">{previewColors.length} 种颜色</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {previewColors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div
                  className="w-12 h-12 rounded-xl border-2 border-border shadow-sm cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (mode === 'free') {
                      if (index === 0) setActiveColorIndex(0);
                      else if (index === 1) setActiveColorIndex(1);
                    }
                  }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
