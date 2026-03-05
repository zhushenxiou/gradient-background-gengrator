# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview and customizable color palettes.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Color Wheel Selection**: Interactive color wheel with support for dual-color selection
- **Color Recommendation System**: Intelligent color recommendations using complementary, analogous, triadic, and split complementary color schemes
- **Two Selection Modes**: 
  - **Free Mode**: Select any two colors independently
  - **Recommended Mode**: Choose one color and get AI-powered color combination suggestions
- **Custom Color Palettes**: Add up to 8 colors to create unique gradients
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Color Recommendation Algorithms

This application implements professional color theory algorithms to suggest harmonious color combinations:

1. **Complementary Colors**: Colors that are directly opposite each other on the color wheel (180° apart), creating high contrast and vibrant combinations
2. **Analogous Colors**: Colors that are adjacent to each other on the color wheel (±30°), creating harmonious and cohesive palettes
3. **Triadic Colors**: Three colors equally spaced around the color wheel (120° apart), offering balanced contrast
4. **Split Complementary Colors**: A base color plus two colors adjacent to its complement (±150° and ±210°), providing high contrast with less tension

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

To run the color utility function tests:

```bash
# First install test dependencies if not already installed
npm install --save-dev jest ts-jest @types/jest

# Then run the tests
npx jest
```

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   └── api/route.ts      # API endpoint for gradient generation
├── components/
│   ├── ColorWheel.tsx    # Interactive color wheel component
│   └── ui/               # UI components (Button, Input, Card)
├── hooks/
│   └── useGradientGenerator.tsx  # Gradient generation state management
└── lib/
    ├── utils.ts          # Color conversion and recommendation algorithms
    ├── constants.ts      # Application constants and presets
    └── __tests__/
        └── colorUtils.test.ts  # Tests for color utility functions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js), your feedback and contributions are welcome!
