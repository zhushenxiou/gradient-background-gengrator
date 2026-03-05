/**
 * 色彩工具函数 - 提供颜色转换和色彩和谐算法
 */

// HSL 颜色类型
export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

// RGB 颜色类型
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

// 色彩和谐方案类型
export type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic';

/**
 * 将 Hex 颜色转换为 RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * 将 RGB 颜色转换为 Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 将 RGB 转换为 HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将 HSL 转换为 RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * 将 Hex 转换为 HSL
 */
export function hexToHsl(hex: string): HSLColor {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * 将 HSL 转换为 Hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * 根据色轮上的角度计算颜色
 */
export function getColorFromWheelAngle(angle: number, saturation: number = 80, lightness: number = 50): string {
  const normalizedAngle = ((angle % 360) + 360) % 360;
  return hslToHex(normalizedAngle, saturation, lightness);
}

/**
 * 获取色轮上的位置（用于在色轮上显示）
 */
export function getWheelPosition(hue: number, saturation: number, radius: number = 100): { x: number; y: number } {
  const angle = (hue - 90) * (Math.PI / 180); // -90度使0度从顶部开始
  const distance = (saturation / 100) * radius;
  return {
    x: radius + distance * Math.cos(angle),
    y: radius + distance * Math.sin(angle)
  };
}

/**
 * 从色轮位置计算 HSL
 */
export function getHslFromWheelPosition(x: number, y: number, radius: number = 100): HSLColor {
  const dx = x - radius;
  const dy = y - radius;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360; // 转换回0-360范围，0度在顶部

  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
  const saturation = Math.round((distance / radius) * 100);

  return {
    h: Math.round(angle),
    s: saturation,
    l: 50 // 默认亮度
  };
}

/**
 * 生成互补色方案（色轮上相对的颜色）
 */
export function generateComplementaryColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);
  const complementaryHue = (hsl.h + 180) % 360;

  return [
    baseHex,
    hslToHex(complementaryHue, hsl.s, hsl.l),
    hslToHex(hsl.h, Math.max(20, hsl.s - 20), Math.min(80, hsl.l + 15)),
    hslToHex(complementaryHue, Math.max(20, hsl.s - 20), Math.min(80, hsl.l + 15))
  ];
}

/**
 * 生成类似色方案（色轮上相邻的颜色）
 */
export function generateAnalogousColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);

  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
    baseHex,
    hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
  ];
}

/**
 * 生成三角色方案（色轮上等距的三种颜色）
 */
export function generateTriadicColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);

  return [
    baseHex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 120) % 360, Math.max(20, hsl.s - 15), Math.min(75, hsl.l + 10)),
    hslToHex((hsl.h + 240) % 360, Math.max(20, hsl.s - 15), Math.min(75, hsl.l + 10))
  ];
}

/**
 * 生成分裂互补色方案
 */
export function generateSplitComplementaryColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);
  const complementaryHue = (hsl.h + 180) % 360;

  return [
    baseHex,
    hslToHex((complementaryHue - 30 + 360) % 360, hsl.s, hsl.l),
    hslToHex((complementaryHue + 30) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, Math.max(20, hsl.s - 20), Math.min(80, hsl.l + 20)),
    hslToHex((complementaryHue - 30 + 360) % 360, Math.max(20, hsl.s - 20), Math.min(80, hsl.l + 20))
  ];
}

/**
 * 生成四角色方案（矩形配色）
 */
export function generateTetradicColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);

  return [
    baseHex,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
  ];
}

/**
 * 生成单色系方案
 */
export function generateMonochromaticColors(baseHex: string): string[] {
  const hsl = hexToHsl(baseHex);

  return [
    hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 30)),
    hslToHex(hsl.h, hsl.s, Math.max(25, hsl.l - 15)),
    baseHex,
    hslToHex(hsl.h, hsl.s, Math.min(85, hsl.l + 15)),
    hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30))
  ];
}

/**
 * 根据类型生成色彩和谐方案
 */
export function generateHarmonyColors(baseHex: string, type: HarmonyType): string[] {
  switch (type) {
    case 'complementary':
      return generateComplementaryColors(baseHex);
    case 'analogous':
      return generateAnalogousColors(baseHex);
    case 'triadic':
      return generateTriadicColors(baseHex);
    case 'split-complementary':
      return generateSplitComplementaryColors(baseHex);
    case 'tetradic':
      return generateTetradicColors(baseHex);
    case 'monochromatic':
      return generateMonochromaticColors(baseHex);
    default:
      return [baseHex];
  }
}

/**
 * 获取所有可用的色彩和谐方案
 */
export const harmonySchemes: { type: HarmonyType; name: string; description: string }[] = [
  { type: 'complementary', name: '互补色', description: '色轮上相对的颜色，对比强烈' },
  { type: 'analogous', name: '类似色', description: '色轮上相邻的颜色，和谐统一' },
  { type: 'triadic', name: '三角色', description: '色轮上等距的三种颜色，平衡丰富' },
  { type: 'split-complementary', name: '分裂互补', description: '基础色与互补色两侧的颜色' },
  { type: 'tetradic', name: '四角色', description: '色轮上矩形分布的四种颜色' },
  { type: 'monochromatic', name: '单色系', description: '同一色相的不同明度和饱和度' }
];

/**
 * 判断颜色是否为有效的 Hex 颜色
 */
export function isValidHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 60; // 60-100%
  const l = Math.floor(Math.random() * 40) + 30; // 30-70%
  return hslToHex(h, s, l);
}
