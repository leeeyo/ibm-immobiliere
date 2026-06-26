"use client";

import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  slow?: boolean;
  className?: string;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  reverse = false,
  slow = false,
  className = "",
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${pauseOnHover ? "marquee-pause" : ""} ${className}`}
      aria-hidden="true"
    >
      <div
        className={`marquee ${reverse ? "marquee-reverse" : ""} ${slow ? "marquee-slow" : ""}`}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12">{children}</div>
      </div>
    </div>
  );
}
