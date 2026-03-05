import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getColorRecommendations
} from '../utils';

describe('Color Utility Functions', () => {
  describe('Color Conversions', () => {
    test('hexToRgb converts hex to RGB correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('rgbToHex converts RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    test('rgbToHsl converts RGB to HSL correctly', () => {
      const redHsl = rgbToHsl(255, 0, 0);
      expect(Math.round(redHsl.h)).toBe(0);
      expect(Math.round(redHsl.s)).toBe(100);
      expect(Math.round(redHsl.l)).toBe(50);
    });

    test('hslToRgb converts HSL to RGB correctly', () => {
      const rgb = hslToRgb(0, 100, 50);
      expect(rgb.r).toBeGreaterThanOrEqual(250);
      expect(rgb.g).toBeLessThanOrEqual(5);
      expect(rgb.b).toBeLessThanOrEqual(5);
    });

    test('round-trip conversion works correctly', () => {
      const originalHex = '#3498db';
      const rgb = hexToRgb(originalHex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const backRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      const backHex = rgbToHex(backRgb.r, backRgb.g, backRgb.b);
      expect(backHex).not.toBeNull();
    });
  });

  describe('Color Recommendations', () => {
    test('getComplementaryColor returns valid color', () => {
      const complementary = getComplementaryColor('#FF0000');
      expect(complementary).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('getAnalogousColors returns two colors', () => {
      const colors = getAnalogousColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    test('getTriadicColors returns two colors', () => {
      const colors = getTriadicColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    test('getSplitComplementaryColors returns two colors', () => {
      const colors = getSplitComplementaryColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    test('getColorRecommendations returns all recommendation types', () => {
      const recommendations = getColorRecommendations('#FF0000');
      expect(recommendations).toHaveLength(4);
      expect(recommendations[0].name).toBe('Complementary');
      expect(recommendations[1].name).toBe('Analogous');
      expect(recommendations[2].name).toBe('Triadic');
      expect(recommendations[3].name).toBe('Split Complementary');
    });
  });
});
