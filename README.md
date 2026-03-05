# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and an innovative color wheel interface featuring intelligent color harmony recommendations.

## Features

- **Interactive Color Wheel**: Select colors visually on a circular color wheel
- **Dual Selection Modes**:
  - **Free Mode**: Manually pick any color on the wheel
  - **Recommend Mode**: Get AI-powered color harmony suggestions based on color theory
- **Color Harmony Algorithms**:
  - **Complementary**: Colors opposite on the color wheel for strong contrast
  - **Analogous**: Adjacent colors for harmonious, unified looks
  - **Triadic**: Three evenly spaced colors for balanced richness
  - **Split-Complementary**: Base color plus two adjacent to its complement
  - **Tetradic**: Four colors in a rectangular pattern
  - **Monochromatic**: Same hue with varying lightness and saturation
- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Testing

Run the color utility tests to verify all color harmony algorithms:

```bash
# Visit the test page in your browser
http://localhost:3000/test

# Or run unit tests (if Jest is configured)
npm test
```

The test page includes:
- Color conversion tests (Hex ↔ RGB ↔ HSL)
- Color harmony algorithm validation
- Interactive demonstrations of all harmony schemes

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or
yarn deploy
# or
pnpm deploy
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## Color Selection Guide

### Free Mode
In Free Mode, you can:
- Click and drag on the color wheel to select any color
- Adjust the lightness slider to fine-tune brightness
- Manually add or remove colors from your palette

### Recommend Mode
In Recommend Mode, the system uses color theory to suggest harmonious color combinations:

1. **Select a base color** on the wheel
2. **Choose a harmony scheme**:
   - **Complementary**: Best for high contrast and visual impact
   - **Analogous**: Best for serene, comfortable designs
   - **Triadic**: Best for vibrant, balanced compositions
   - **Split-Complementary**: Best for strong visual contrast with less tension
   - **Tetradic**: Best for rich, complex color schemes
   - **Monochromatic**: Best for clean, elegant designs
3. The system automatically generates a harmonious color palette

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

### Example Response:
Returns an SVG image with the specified gradient.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── route.ts          # API endpoint for gradient generation
│   ├── test/
│   │   └── page.tsx          # Test page for color utilities
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/                   # UI components (Button, Card, Input)
│   └── ColorWheel.tsx        # Interactive color wheel component
├── hooks/
│   └── useGradientGenerator.tsx  # Custom hook for gradient generation
└── lib/
    ├── services/
    │   └── gradientGenerator.ts  # SVG generation logic
    ├── colorUtils.ts         # Color conversion & harmony algorithms
    ├── constants.ts          # Color presets
    └── utils.ts              # Utility functions
```

## Color Harmony Algorithms

The application implements six classic color harmony schemes based on the color wheel:

### Complementary (互补色)
Colors opposite each other on the color wheel (180° apart). Creates maximum contrast and visual impact.

### Analogous (类似色)
Colors adjacent to each other on the color wheel (within 30°). Creates serene, comfortable designs.

### Triadic (三角色)
Three colors evenly spaced on the color wheel (120° apart). Offers strong visual contrast while maintaining harmony.

### Split-Complementary (分裂互补)
A variation of complementary that uses the two colors adjacent to the complement. Less contrast but more nuance.

### Tetradic (四角色)
Four colors arranged in a rectangle on the color wheel. Rich, complex color schemes with plenty of possibilities.

### Monochromatic (单色系)
Variations of a single hue using different saturation and lightness values. Clean, elegant, and easy to balance.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages via OpenNext

## Browser Console Testing

You can also run quick color utility tests in the browser console:

```javascript
// Import the test runner
import { runManualTests } from '@/lib/__tests__/colorUtils.test';

// Run tests
runManualTests();
```

Or use individual functions:

```javascript
import { generateHarmonyColors, hexToHsl } from '@/lib/colorUtils';

// Generate complementary colors
const colors = generateHarmonyColors('#FF0000', 'complementary');
console.log(colors); // ['#FF0000', '#00FFFF', ...]

// Convert hex to HSL
const hsl = hexToHsl('#5135FF');
console.log(hsl); // { h: 252, s: 100, l: 60 }
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS
- [Color Theory Basics](https://en.wikipedia.org/wiki/Color_theory) - understand color harmony principles

## License

This project is open source and available under the MIT License.
