import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
  showArea?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color = 'currentColor',
  height = 20,
  className = '',
  showArea = false,
}) => {
  // 转换数据格式以适应recharts
  const chartData = data.map((value, index) => ({ value, index }));
  
  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
            fill={showArea ? color : 'transparent'}
            fillOpacity={0.1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 