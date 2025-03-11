import { useState, useEffect } from 'react';
import { WaterQualityParameter } from '../types/parameters';

// 每个参数的趋势数据
export interface ParameterTrend {
  parameterId: string; 
  values: number[];
  trend: 'up' | 'down' | 'stable';
  changePct: number;
}

/**
 * 随机生成趋势数据的Hook
 * 
 * 在实际应用中，这个Hook会从API获取历史数据
 * 这里我们使用模拟数据来展示功能
 */
export const useParameterTrends = (parameters: WaterQualityParameter[]) => {
  const [trends, setTrends] = useState<Record<string, ParameterTrend>>({});

  // 为每个参数生成趋势数据
  useEffect(() => {
    if (!parameters.length) return;

    const newTrends: Record<string, ParameterTrend> = {};

    parameters.forEach(param => {
      // 为参数生成历史数据点
      const dataPoints = generateTrendData(param);
      
      // 计算变化趋势和百分比
      const { trend, changePct } = calculateTrend(dataPoints, param.current);
      
      newTrends[param.id] = {
        parameterId: param.id,
        values: dataPoints,
        trend,
        changePct
      };
    });

    setTrends(newTrends);
  }, [parameters]);

  return trends;
};

/**
 * 生成随机趋势数据
 * 在实际应用中，这会被真实数据替代
 */
function generateTrendData(parameter: WaterQualityParameter): number[] {
  const pointCount = 20; // 生成20个数据点
  const currentValue = parameter.current;
  const minValue = parameter.range ? parameter.range[0] : currentValue * 0.8;
  const maxValue = parameter.range ? parameter.range[1] : currentValue * 1.2;
  
  // 以当前值为基础，生成波动的历史数据
  const values: number[] = [];
  let lastValue = currentValue;
  
  for (let i = 0; i < pointCount; i++) {
    // 随机波动但保持在合理范围内
    const volatility = (maxValue - minValue) * 0.1; // 波动幅度
    const change = (Math.random() - 0.5) * volatility;
    const newValue = Math.max(minValue, Math.min(maxValue, lastValue + change));
    values.unshift(newValue); // 添加到数组开头，使最新的数据在数组末尾
    lastValue = newValue;
  }
  
  // 确保最后一个值是当前值
  values[values.length - 1] = currentValue;
  
  return values;
}

/**
 * 基于历史数据计算趋势
 */
function calculateTrend(values: number[], currentValue: number): { trend: 'up' | 'down' | 'stable', changePct: number } {
  if (values.length < 2) {
    return { trend: 'stable', changePct: 0 };
  }
  
  // 计算过去几个点的平均值
  const pastSampleSize = Math.min(5, Math.floor(values.length / 3));
  const pastValues = values.slice(0, pastSampleSize);
  const pastAverage = pastValues.reduce((sum, val) => sum + val, 0) / pastValues.length;
  
  // 计算变化百分比
  const changePct = ((currentValue - pastAverage) / pastAverage) * 100;
  
  // 确定趋势
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (changePct > 2) {
    trend = 'up';
  } else if (changePct < -2) {
    trend = 'down';
  }
  
  return { trend, changePct: parseFloat(changePct.toFixed(1)) };
} 