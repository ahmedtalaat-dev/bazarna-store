"use client";

import { useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatProps {
  value: number | string;
  suffix?: string;
  label: string;
}

export default function Stat({ value, suffix = "", label }: StatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  const isNumber = typeof value === "number";

  useEffect(() => {
    if (isNumber && isInView) {
      const controls = animate(motionValue, value as number, {
        duration: 2,
        onUpdate: (v) => setDisplayValue(Math.floor(v)),
      });

      return () => controls.stop();
    }
  }, [isNumber, isInView, value, motionValue]);

  return (
    <div ref={ref}>
      <p className="text-5xl font-bold text-blue-600 mb-2">
        {isNumber ? displayValue : value}
        {suffix}
      </p>
      <p className="text-gray-600">{label}</p>
    </div>
  );}