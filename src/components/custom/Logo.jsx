"use client";
import { NotebookPen } from "lucide-react";

// size: 'sm' | 'md' | 'lg'
// style: 'inline' | 'stacked'
const Logo = ({ size, style }) => {
  return (
    <div
      className={`flex items-center justify-center
         ${style === "inline" ? "flex-row" : ""} ${
        style === "block" ? "flex-col" : ""
      }`}
    >
      <NotebookPen
        className={`${size === "sm" ? "size-8" : ""}${
          size === "md" ? "size-12" : ""
        }${size === "lg" ? "size-16" : ""}`}
      />
      <span
        className={`font-[600] ${size === "sm" ? " text-lg font-[400]" : ""}${
          size === "md" ? " text-2xl" : ""
        }${size === "lg" ? " text-4xl" : ""}`}
      >
        Memoize
      </span>
    </div>
  );
};

export default Logo;
