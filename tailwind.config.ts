/* eslint-disable @typescript-eslint/no-require-imports */
import defaultTheme from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

import colorsJson from "./colors.json";

const colors = Object.keys(colorsJson).reduce(
  (acc, key) => {
    acc[key] = `var(--${key})`;

    return acc;
  },
  {} as Record<string, string>
);

const sizes = Array.from({ length: 1000 }, (_, i) => i).reduce(
  (acc, curr) => {
    acc[curr] = `${curr}px`;

    return acc;
  },
  {
    max: "max-content",
    unset: "unset",
    full: "100%",
    inherit: "inherit",
    "1/2": "50%",
    "1/3": "33.3%",
    "2/3": "66.6%",
    "1/4": "25%",
    "1/6": "16.6%",
    "2/6": "33.3%",
    "3/6": "50%",
    "4/6": "66.6%",
    "5/6": "83.3%"
  } as Record<string, string>
);

const opacities = Array.from({ length: 100 }, (_, i) => i).reduce(
  (acc, curr) => {
    acc[curr] = curr / 100 + "";

    return acc;
  },
  {} as Record<string, string>
);

const transitionDurations = Array.from({ length: 60 }, (_, i) => i).reduce(
  (acc, curr) => {
    acc[curr] = curr * 50 + "";

    return acc;
  },
  {} as Record<string, string>
);

const themeConfig: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components-new/**/*.{js,ts,jsx,tsx,mdx}",
    "./styling-reference/ai-ready-website/app/**/*.{ts,tsx}",
    "./styling-reference/ai-ready-website/components/**/*.{ts,tsx}",
    "./styling-reference/ai-ready-website/components-new/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-questrial)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "#020405",
        surface: "#0A0F14",
        surfaceHighlight: "#151E26",
        primary: {
          DEFAULT: "#06B6D4",
          highlight: "#22D3EE",
          foreground: "#000000",
        },
        border: "rgba(6,182,212,0.1)",
        transparent: "transparent",
        current: "currentColor",
        ...colors
      },
      screens: {
        xs: { min: "390px" },
        "xs-max": { max: "389px" },
        sm: { min: "576px" },
        "sm-max": { max: "575px" },
        md: { min: "768px" },
        "md-max": { max: "767px" },
        lg: { min: "996px" },
        "lg-max": { max: "995px" },
        xl: { min: "1200px" },
        "xl-max": { max: "1199px" }
      },
      opacity: opacities,
      spacing: {
        ...sizes,
        'root': 'var(--root-padding)'
      },
      width: sizes,
      maxWidth: sizes,
      height: sizes,
      inset: sizes,
      borderWidth: sizes,
      backdropBlur: Array.from({ length: 20 }, (_, i) => i).reduce(
        (acc, curr) => {
          acc[curr] = curr + "px";

          return acc;
        },
        {} as Record<string, string>
      ),
      transitionTimingFunction: { DEFAULT: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
      transitionDuration: {
        DEFAULT: "200ms",
        ...transitionDurations
      },
      transitionDelay: {
        ...transitionDurations
      },
      borderRadius: (() => {
        const radius: Record<string | number, string> = {
          full: "999px",
          inherit: "inherit",
          0: "0px",
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        };

        for (let i = 1; i <= 32; i += 1) {
          radius[i] = `${i}px`;
        }

        return radius;
      })(),
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "glow-slow": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8",
          },
        },
        scan: {
          "0%": {
            transform: "translateY(-100%)",
          },
          "100%": {
            transform: "translateY(100vh)",
          },
        },
        progressBar: {
          "0%": { width: "0%" },
          "50%": { width: "70%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "glow-slow": "glow-slow 3s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        progressBar: "progressBar 2s ease-in-out infinite",
      },
    }
  },
  plugins: [
    ({
      addUtilities, matchUtilities
    }: any) => {
      addUtilities({
        // Inside-border utilities are defined in inside-border-fix.css to avoid Tailwind variant conflicts
        '.mask-border': {
          "mask": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          "mask-composite": "exclude",
          "pointer-events": "none"
        },
        ".center-x": { "@apply absolute left-1/2 -translate-x-1/2": {} },
        ".center-y": { "@apply absolute top-1/2 -translate-y-1/2": {} },
        ".center": { "@apply absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2": {} },
        ".flex-center": { "@apply flex items-center justify-center": {} },
        ".overlay": { "@apply absolute top-0 left-0 w-full h-full rounded-inherit": {} },
        ".text-gradient": { "@apply !bg-clip-text !text-transparent": {} }
      });
      matchUtilities(
        {
          'cw': (value: string) => {
            const width = parseInt(value);

            return {
              width: value,
              left: `calc(50% - ${width / 2}px)`
            };
          },
          'ch': (value: string) => {
            const height = parseInt(value);

            return {
              height: value,
              top: `calc(50% - ${height / 2}px)`
            };
          },
          'cs': (value: string) => {
            const size = parseInt(value);

            return {
              width: size,
              height: size,
              left: `calc(50% - ${size / 2}px)`,
              top: `calc(50% - ${size / 2}px)`
            };
          },
          'cmw': (value: string) => {
            const [maxWidth, paddingX] = value.split(',').map((v) => parseInt(v));

            const width = paddingX ? `calc(100% - ${paddingX * 2}px)` : '100%';

            return {
              maxWidth: maxWidth,
              width,
              left: `calc(50% - (min(${maxWidth}px, ${width}) / 2))`
            };
          },
          'mw': (value: string) => {
            const [maxWidth, paddingX] = value.split(',').map((v) => parseInt(v));

            const width = paddingX ? `calc(100% - ${paddingX * 2}px)` : '100%';

            return {
              maxWidth: maxWidth,
              width
            };
          }
        },
        { values: sizes }
      );
    },
    require("tailwind-gradient-mask-image"),
    require("@tailwindcss/typography"),
  ]
};

export default themeConfig;