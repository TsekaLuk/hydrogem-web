import React from 'react';
import { cn } from '@/lib/utils';

export default function NineDotGridRandom() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[...new Array(9)].map((_, index) => (
        <div
          className={cn(
            "size-5 origin-center rounded-xl bg-neutral-800 dark:invert",
            "dot-animate",
            `dot-animate-delay-${index}`
          )}
          key={index.toString()}
        />
      ))}
    </div>
  );
}
