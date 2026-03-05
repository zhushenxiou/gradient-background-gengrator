/**
 * 色彩工具函数测试
 * 运行测试: npm test
 */

import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getColorFromWheelAngle,
  getWheelPosition,
  getHslFromWheelPosition,
  generateComplementaryColors,
  generateAnalogousColors,
  generateTriadicColors,
  generateSplitComplementaryColors,
  generateTetradicColors,
  generateMonochromaticColors,
  generateHarmonyColors,
  isValidHex,
  generateRandomColor,
  type HarmonyType
} from '../colorUtils';

describe('Color Utils', () => {
  describe('Hex <-> RGB Conversion', () => {
    test('hexToRgb converts #FF0000 to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('hexToRgb converts #00FF00 to RGB', () => {
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('hexToRgb converts #0000FF to RGB', () => {
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('rgbToHex converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
    });

    test('round-trip conversion', () => {
      const original = '#7F3FA0';
      const rgb = hexToRgb(original);
      const result = rgbToHex(rgb.r, rgb.g, rgb.b);
      expect(result).toBe(original);
    });
  });

  describe('RGB <-> HSL Conversion', () => {
    test('rgbToHsl converts red to HSL', () => {
      const hsl = rgbToHsl(255, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    test('rgbToHsl converts green to HSL', () => {
      const hsl = rgbToHsl(0, 255, 0);
      expect(hsl.h).toBe(120);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    test('rgbToHsl converts blue to HSL', () => {
      const hsl = rgbToHsl(0, 0, 255);
      expect(hsl.h).toBe(240);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    test('hslToRgb converts HSL to RGB', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('round-trip HSL conversion', () => {
      const original = { h: 180, s: 75, l: 45 };
      const rgb = hslToRgb(original.h, original.s, original.l);
      const result = rgbToHsl(rgb.r, rgb.g, rgb.b);
      expect(result.h).toBeCloseTo(original.h, -1);
      expect(result.s).toBeCloseTo(original.s, -1);
      expect(result.l).toBeCloseTo(original.l, -1);
    });
  });

  describe('Hex <-> HSL Conversion', () => {
    test('hexToHsl converts hex to HSL', () => {
      const hsl = hexToHsl('#FF0000');
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    test('hslToHex converts HSL to hex', () => {
      expect(hslToHex(0, 100, 50)).toBe('#FF0000');
      expect(hslToHex(120, 100, 50)).toBe('#00FF00');
      expect(hslToHex(240, 100, 50)).toBe('#0000FF');
    });
  });

  describe('Wheel Functions', () => {
    test('getColorFromWheelAngle returns correct color', () => {
      expect(getColorFromWheelAngle(0, 100, 50)).toBe('#FF0000');
      expect(getColorFromWheelAngle(120, 100, 50)).toBe('#00FF00');
      expect(getColorFromWheelAngle(240, 100, 50)).toBe('#0000FF');
    });

    test('getWheelPosition returns correct position', () => {
      // 0度（红色）应该在顶部
      const pos0 = getWheelPosition(0, 100, 100);
      expect(pos0.x).toBeCloseTo(100, 0);
      expect(pos0.y).toBeCloseTo(0, 0);

      // 90度应该在右侧
      const pos90 = getWheelPosition(90, 100, 100);
      expect(pos90.x).toBeCloseTo(200, 0);
      expect(pos90.y).toBeCloseTo(100, 0);
    });

    test('getHslFromWheelPosition returns correct HSL', () => {
      // 中心位置应该返回低饱和度
      const centerHsl = getHslFromWheelPosition(100, 100, 100);
      expect(centerHsl.s).toBe(0);

      // 顶部位置应该返回0度色相
      const topHsl = getHslFromWheelPosition(100, 0, 100);
      expect(topHsl.h).toBe(0);
    });
  });

  describe('Color Harmony Algorithms', () => {
    test('generateComplementaryColors returns correct colors', () => {
      const colors = generateComplementaryColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(2);
      expect(colors[0]).toBe('#FF0000');
      // 互补色应该是青色
      const hsl = hexToHsl(colors[1]);
      expect(hsl.h).toBeGreaterThan(170);
      expect(hsl.h).toBeLessThan(190);
    });

    test('generateAnalogousColors returns adjacent colors', () => {
      const colors = generateAnalogousColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(3);
      expect(colors[2]).toBe('#FF0000'); // 基础颜色在中间

      // 检查相邻颜色的色相差异
      const hsl0 = hexToHsl(colors[0]);
      const hsl2 = hexToHsl(colors[2]);
      const hueDiff = Math.abs(hsl0.h - hsl2.h);
      expect(hueDiff).toBeLessThanOrEqual(60); // 最大30度差异
    });

    test('generateTriadicColors returns evenly spaced colors', () => {
      const colors = generateTriadicColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(3);

      const hsl0 = hexToHsl(colors[0]);
      const hsl1 = hexToHsl(colors[1]);
      const hsl2 = hexToHsl(colors[2]);

      const diff1 = (hsl1.h - hsl0.h + 360) % 360;
      const diff2 = (hsl2.h - hsl1.h + 360) % 360;

      expect(diff1).toBeGreaterThan(110);
      expect(diff1).toBeLessThan(130);
      expect(diff2).toBeGreaterThan(110);
      expect(diff2).toBeLessThan(130);
    });

    test('generateSplitComplementaryColors returns correct colors', () => {
      const colors = generateSplitComplementaryColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(3);
      expect(colors[0]).toBe('#FF0000');
    });

    test('generateTetradicColors returns rectangle colors', () => {
      const colors = generateTetradicColors('#FF0000');
      expect(colors.length).toBe(4);

      const hsl0 = hexToHsl(colors[0]);
      const hsl1 = hexToHsl(colors[1]);
      const hsl2 = hexToHsl(colors[2]);

      const diff1 = (hsl1.h - hsl0.h + 360) % 360;
      const diff2 = (hsl2.h - hsl0.h + 360) % 360;

      expect(diff1).toBeGreaterThan(80);
      expect(diff1).toBeLessThan(100);
      expect(diff2).toBeGreaterThan(170);
      expect(diff2).toBeLessThan(190);
    });

    test('generateMonochromaticColors returns same hue', () => {
      const colors = generateMonochromaticColors('#FF0000');
      expect(colors.length).toBe(5);

      const baseHsl = hexToHsl('#FF0000');
      colors.forEach(color => {
        const hsl = hexToHsl(color);
        expect(hsl.h).toBe(baseHsl.h);
      });
    });

    test('generateHarmonyColors dispatches correctly', () => {
      const types: HarmonyType[] = ['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'monochromatic'];

      types.forEach(type => {
        const colors = generateHarmonyColors('#5135FF', type);
        expect(colors.length).toBeGreaterThanOrEqual(2);
        expect(colors[0]).toBe('#5135FF');
      });
    });
  });

  describe('Utility Functions', () => {
    test('isValidHex validates correct hex colors', () => {
      expect(isValidHex('#FF0000')).toBe(true);
      expect(isValidHex('#ff0000')).toBe(true);
      expect(isValidHex('#F00')).toBe(true);
      expect(isValidHex('#f00')).toBe(true);
      expect(isValidHex('#123ABC')).toBe(true);
    });

    test('isValidHex rejects invalid hex colors', () => {
      expect(isValidHex('FF0000')).toBe(false);
      expect(isValidHex('#GG0000')).toBe(false);
      expect(isValidHex('#FF00')).toBe(false);
      expect(isValidHex('#FF00000')).toBe(false);
      expect(isValidHex('')).toBe(false);
    });

    test('generateRandomColor returns valid hex', () => {
      const color = generateRandomColor();
      expect(isValidHex(color)).toBe(true);
    });

    test('generateRandomColor returns different colors', () => {
      const color1 = generateRandomColor();
      const color2 = generateRandomColor();
      expect(color1).not.toBe(color2);
    });
  });
});

// 手动测试运行器（如果没有 Jest 环境）
export function runManualTests() {
  console.log('Running manual color utils tests...\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.error(`  Error: ${error}`);
      failed++;
    }
  }

  // Hex <-> RGB 测试
  test('hexToRgb converts #FF0000', () => {
    const result = hexToRgb('#FF0000');
    if (result.r !== 255 || result.g !== 0 || result.b !== 0) {
      throw new Error(`Expected {r: 255, g: 0, b: 0}, got ${JSON.stringify(result)}`);
    }
  });

  test('rgbToHex converts red', () => {
    const result = rgbToHex(255, 0, 0);
    if (result !== '#FF0000') {
      throw new Error(`Expected #FF0000, got ${result}`);
    }
  });

  // HSL 转换测试
  test('hexToHsl converts red', () => {
    const result = hexToHsl('#FF0000');
    if (result.h !== 0 || result.s !== 100 || result.l !== 50) {
      throw new Error(`Expected {h: 0, s: 100, l: 50}, got ${JSON.stringify(result)}`);
    }
  });

  // 色彩和谐算法测试
  test('generateComplementaryColors returns 4 colors', () => {
    const colors = generateComplementaryColors('#FF0000');
    if (colors.length !== 4) {
      throw new Error(`Expected 4 colors, got ${colors.length}`);
    }
  });

  test('generateAnalogousColors includes base color', () => {
    const colors = generateAnalogousColors('#00FF00');
    if (!colors.includes('#00FF00')) {
      throw new Error(`Base color #00FF00 not found in ${colors.join(', ')}`);
    }
  });

  test('generateTriadicColors returns evenly spaced colors', () => {
    const colors = generateTriadicColors('#FF0000');
    if (colors.length < 3) {
      throw new Error(`Expected at least 3 colors, got ${colors.length}`);
    }
  });

  test('isValidHex validates correct hex', () => {
    if (!isValidHex('#FF0000')) {
      throw new Error('#FF0000 should be valid');
    }
    if (isValidHex('invalid')) {
      throw new Error('"invalid" should not be valid');
    }
  });

  console.log(`\nTests completed: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

// 如果直接运行此文件，执行手动测试
if (typeof window !== 'undefined') {
  (window as any).runColorTests = runManualTests;
}
