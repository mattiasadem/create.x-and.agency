"use client";

import { useState, useEffect } from "react";


type Options = {
  randomizeChance?: number;
  reversed?: boolean;
};

export const encryptText = (
  text: string,
  progress: number,
  _options?: Options,
) => {
  const options = {
    randomizeChance: 0.7,
    ..._options,
  };

  const encryptionChars = "a-zA-Z0-9*=?!";
  const skipTags = ["<br class='lg-max:hidden'>", "<span>", "</span>"];

  // Calculate how many characters should be encrypted
  const totalChars = text.length;
  const encryptedCount = Math.floor(totalChars * (1 - progress));

  let result = "";
  let charIndex = 1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Check if we're at the start of a tag to skip
    let shouldSkip = false;

    for (const tag of skipTags) {
      if (text.substring(i, i + tag.length) === tag) {
        result += tag;
        i += tag.length - 1; // -1 because loop will increment
        shouldSkip = true;
        break;
      }
    }

    if (shouldSkip) continue;

    // Skip spaces - keep them as is
    if (char === " ") {
      result += char;
      charIndex++;
      continue;
    }

    // If this character should be encrypted
    if (
      options.reversed
        ? charIndex < encryptedCount
        : text.length - charIndex < encryptedCount
    ) {
      // 40% chance to show original character, 60% chance to encrypt
      if (Math.random() < options.randomizeChance) {
        result += char;
      } else {
        // Use random character from encryption set
        const randomIndex = Math.floor(Math.random() * encryptionChars.length);
        result += encryptionChars[randomIndex];
      }
    } else {
      // Keep original character
      result += char;
    }

    charIndex++;
  }

  return result;
};

export default function HomeHeroTitle() {
  const [index, setIndex] = useState(0);
  const words = ["Websites", "Apps", "AI Agents", "Automations", "Brands", "Products"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="mx-auto text-center mb-12 lg:mb-16">
      <style jsx>{`
        @keyframes cool-slide-up {
            0% {
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                filter: blur(4px);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        .animate-word {
            animation: cool-slide-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal font-display tracking-wide text-white flex flex-col items-center justify-center gap-2">
        <span>You can create</span>
        <span key={index} className="animate-word bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-display font-normal whitespace-nowrap pb-2">
          {words[index]}
        </span>
      </h1>
    </div>
  );
}
