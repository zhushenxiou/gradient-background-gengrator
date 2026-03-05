'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  generateComplementaryColors,
  generateAnalogousColors,
  generateTriadicColors,
  generateSplitComplementaryColors,
  generateTetradicColors,
  generateMonochromaticColors,
  isValidHex,
  generateRandomColor,
} from '@/lib/colorUtils';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runTests = () => {
    setIsRunning(true);
    setResults([]);

    const testResults: TestResult[] = [];

    // 辅助函数
    const test = (name: string, fn: () => void) => {
      try {
        fn();
        testResults.push({ name, passed: true });
      } catch (error) {
        testResults.push({
          name,
          passed: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };

    const expect = (actual: unknown) => ({
      toBe: (expected: unknown) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`);
        }
      },
      toEqual: (expected: unknown) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
      },
      toBeGreaterThan: (expected: number) => {
        if (!(actual as number) > expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toBeLessThan: (expected: number) => {
        if (!(actual as number) < expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual: (expected: number) => {
        if ((actual as number) < expected) {
          throw new Error(`Expected ${actual} to be >= ${expected}`);
        }
      },
      toBeCloseTo: (expected: number, precision: number) => {
        const multiplier = Math.pow(10, -precision);
        if (Math.abs((actual as number) - expected) > multiplier) {
          throw new Error(`Expected ${actual} to be close to ${expected}`);
        }
      }
    });

    // ===== 颜色转换测试 =====
    test('hexToRgb converts #FF0000 to RGB', () => {
      const result = hexToRgb('#FF0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('hexToRgb converts #00FF00 to RGB', () => {
      const result = hexToRgb('#00FF00');
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('hexToRgb converts #0000FF to RGB', () => {
      const result = hexToRgb('#0000FF');
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('rgbToHex converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
    });

    test('round-trip hex->rgb->hex conversion', () => {
      const original = '#7F3FA0';
      const rgb = hexToRgb(original);
      const result = rgbToHex(rgb.r, rgb.g, rgb.b);
      expect(result).toBe(original);
    });

    // ===== HSL 转换测试 =====
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

    // ===== 色彩和谐算法测试 =====
    test('generateComplementaryColors returns 4 colors', () => {
      const colors = generateComplementaryColors('#FF0000');
      expect(colors.length).toBe(4);
    });

    test('generateComplementaryColors first color is base', () => {
      const colors = generateComplementaryColors('#FF0000');
      expect(colors[0]).toBe('#FF0000');
    });

    test('generateAnalogousColors includes base color', () => {
      const colors = generateAnalogousColors('#00FF00');
      const hasBaseColor = colors.some(c => c.toUpperCase() === '#00FF00');
      if (!hasBaseColor) {
        throw new Error(`Base color #00FF00 not found in ${colors.join(', ')}`);
      }
    });

    test('generateAnalogousColors returns 5 colors', () => {
      const colors = generateAnalogousColors('#FF0000');
      expect(colors.length).toBe(5);
    });

    test('generateTriadicColors returns at least 3 colors', () => {
      const colors = generateTriadicColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(3);
    });

    test('generateSplitComplementaryColors returns at least 3 colors', () => {
      const colors = generateSplitComplementaryColors('#FF0000');
      expect(colors.length).toBeGreaterThanOrEqual(3);
    });

    test('generateTetradicColors returns 4 colors', () => {
      const colors = generateTetradicColors('#FF0000');
      expect(colors.length).toBe(4);
    });

    test('generateMonochromaticColors returns 5 colors', () => {
      const colors = generateMonochromaticColors('#FF0000');
      expect(colors.length).toBe(5);
    });

    test('generateMonochromaticColors all have same hue', () => {
      const baseHsl = hexToHsl('#FF0000');
      const colors = generateMonochromaticColors('#FF0000');
      colors.forEach(color => {
        const hsl = hexToHsl(color);
        expect(hsl.h).toBe(baseHsl.h);
      });
    });

    // ===== 工具函数测试 =====
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
      if (color1 === color2) {
        throw new Error(`Expected different colors, got ${color1} twice`);
      }
    });

    // 模拟异步延迟以显示加载状态
    setTimeout(() => {
      setResults(testResults);
      setIsRunning(false);
    }, 500);
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            色彩工具函数测试
          </h1>
          <p className="text-muted-foreground">
            验证颜色转换和色彩和谐算法的正确性
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    运行中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    运行测试
                  </>
                )}
              </Button>
              {results.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setResults([])}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </Button>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{passedCount} 通过</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>{failedCount} 失败</span>
                </div>
                <div className="text-muted-foreground">
                  共 {results.length} 个测试
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">测试结果</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.passed
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{result.name}</div>
                      {!result.passed && result.error && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Summary */}
        {results.length > 0 && !isRunning && (
          <Card className={`p-6 ${
            failedCount === 0
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          }`}>
            <div className="text-center">
              {failedCount === 0 ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    所有测试通过！
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    色彩工具函数工作正常
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                    部分测试失败
                  </h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    {failedCount} 个测试未通过，请检查实现
                  </p>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Algorithm Demo */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">色彩和谐算法演示</h2>
          <div className="space-y-4">
            {[
              { name: '互补色 (Complementary)', fn: generateComplementaryColors },
              { name: '类似色 (Analogous)', fn: generateAnalogousColors },
              { name: '三角色 (Triadic)', fn: generateTriadicColors },
              { name: '分裂互补 (Split-Complementary)', fn: generateSplitComplementaryColors },
              { name: '四角色 (Tetradic)', fn: generateTetradicColors },
              { name: '单色系 (Monochromatic)', fn: generateMonochromaticColors },
            ].map((scheme) => {
              const colors = scheme.fn('#5135FF');
              return (
                <div key={scheme.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium truncate">{scheme.name}</div>
                  <div className="flex gap-1">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
