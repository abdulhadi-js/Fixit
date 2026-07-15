"use client";

import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    // Generate styles only on the client to avoid hydration mismatch
    const styles = [...new Array(number)].map(() => ({
      top: Math.floor(Math.random() * 400) - 100 + "px",
      left: Math.floor(Math.random() * 1200) - 400 + "px",
      animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute size-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
          style={style}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};
