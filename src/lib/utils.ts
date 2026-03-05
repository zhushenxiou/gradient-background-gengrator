import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function colorToParam(color: string): string {
  if (color.startsWith('#')) {
    return 'hex_' + color.slice(1);
  }
  return color;
}

export function paramToColor(param: string): string {
  if (param.startsWith('hex_')) {
    return '#' + param.slice(4);
  }
  return param;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + 180) % 360;
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

export function getAnalogousColors(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];
  
  [-30, 30].forEach(offset => {
    const newH = (hsl.h + offset + 360) % 360;
    const newRgb = hslToRgb(newH, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return colors;
}

export function getTriadicColors(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];
  
  [120, 240].forEach(offset => {
    const newH = (hsl.h + offset) % 360;
    const newRgb = hslToRgb(newH, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return colors;
}

export function getSplitComplementaryColors(hex: string): string[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors: string[] = [];
  
  [150, 210].forEach(offset => {
    const newH = (hsl.h + offset) % 360;
    const newRgb = hslToRgb(newH, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  });
  
  return colors;
}

export interface ColorRecommendation {
  name: string;
  colors: string[];
}

export function getColorRecommendations(hex: string): ColorRecommendation[] {
  const recommendations: ColorRecommendation[] = [
    { name: 'Complementary', colors: [getComplementaryColor(hex)] },
    { name: 'Analogous', colors: getAnalogousColors(hex) },
    { name: 'Triadic', colors: getTriadicColors(hex) },
    { name: 'Split Complementary', colors: getSplitComplementaryColors(hex) }
  ];
  return recommendations;
}

export function getAngleFromPoint(x: number, y: number, centerX: number, centerY: number): number {
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return angle;
}

export function getDistanceFromCenter(x: number, y: number, centerX: number, centerY: number): number {
  const dx = x - centerX;
  const dy = y - centerY;
  return Math.sqrt(dx * dx + dy * dy);
}