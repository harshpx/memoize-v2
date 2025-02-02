"use client";
import Image from "next/image";
import memoize from "@/assets/images/memoize.png";

// size: 'sm' | 'md' | 'lg'
// style: 'inline' | 'stacked'
const Logo = ({ size, style }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        style === "inline" ? "flex-row" : ""
      }${style === "block" ? "flex-col" : ""}`}
    >
      <Image
        src={memoize}
        alt="Memoize Logo"
        className={`${size === "sm" ? "size-10" : ""}${
          size === "md" ? "size-14" : ""
        }${size === "lg" ? "size-20" : ""}`}
      />
      <span
        className={`text-[#27a6ff] ${
          size === "sm" ? " text-lg font-[400]" : ""
        }${size === "md" ? " text-2xl" : ""}${
          size === "lg" ? " text-4xl" : ""
        }`}
      >
        Memoize
      </span>
    </div>
  );
};

export default Logo;
