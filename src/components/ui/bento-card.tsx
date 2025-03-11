import React from "react";
import { motion } from "framer-motion";
import { AnimatedGradient } from "./animated-gradient";
import { cn } from "../../lib/utils";

interface BentoCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientClassName?: string;
  onClick?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  gradientClassName,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background dark:bg-background/50 rounded-xl shadow-sm border border-border/40",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {gradientClassName && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30",
          gradientClassName
        )} />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { BentoCard }; 