import React from "react";
import { cn } from "../../lib/utils";

interface AnimatedGradientProps {
  colors: string[];
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  className,
}) => {
  // 创建一个渐变背景
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})`,
  };

  return (
    <div 
      className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-30",
        className
      )} 
      style={gradientStyle}
    />
  );
};

export { AnimatedGradient }; 