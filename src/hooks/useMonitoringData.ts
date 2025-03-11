import { useState, useEffect } from 'react';
import { WaterQualityParameter } from '../types/parameters';

// 模拟数据 - 在实际应用中，这些数据会从API获取
const mockParameters: WaterQualityParameter[] = [
  // 温度参数
  {
    id: 'temperature',
    name: '水温',
    category: 'physical',
    current: 24.5,
    unit: '°C',
    range: [15, 30],
    optimal: [20, 26],
    status: 'good',
    importance: 'high'
  },
  // 基础物理参数
  {
    id: 'ph',
    name: 'pH值',
    category: 'physical',
    current: 8.7,
    unit: 'pH',
    range: [6.5, 9.0],
    optimal: [7.0, 8.5],
    status: 'warning',
    importance: 'high'
  },
  {
    id: 'dissolved_oxygen',
    name: '溶解氧',
    category: 'physical',
    current: 5.2,
    unit: 'mg/L',
    range: [4, 12],
    optimal: [6, 10],
    status: 'warning',
    importance: 'high'
  },
  {
    id: 'conductivity',
    name: '电导率',
    category: 'physical',
    current: 1250,
    unit: 'μS/cm',
    range: [0, 2500],
    optimal: [500, 1500],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'turbidity',
    name: '浊度',
    category: 'physical',
    current: 0.48,
    unit: 'NTU',
    range: [0, 1.0],
    optimal: [0, 0.5],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'resistivity',
    name: '电阻率',
    category: 'physical',
    current: 2000,
    unit: 'Ω·m',
    range: [1800, 3000],
    optimal: [2000, 2500],
    status: 'good',
    importance: 'low'
  },
  {
    id: 'salinity',
    name: '盐度',
    category: 'physical',
    current: 500,
    unit: 'mg/L',
    range: [0, 1000],
    optimal: [100, 600],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'tds',
    name: '总溶解固体',
    category: 'physical',
    current: 500,
    unit: 'mg/L',
    range: [0, 1000],
    optimal: [100, 500],
    status: 'good',
    importance: 'medium'
  },
  // 氮相关指标
  {
    id: 'total_nitrogen',
    name: '总氮',
    category: 'chemical',
    current: 0.5,
    unit: 'mg/L',
    range: [0, 1.0],
    optimal: [0, 0.5],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'ammonia',
    name: '氨氮',
    category: 'chemical',
    current: 0.8,
    unit: 'mg/L',
    range: [0, 1.0],
    optimal: [0, 0.5],
    status: 'warning',
    importance: 'high'
  },
  {
    id: 'nitrite',
    name: '亚硝酸盐',
    category: 'chemical',
    current: 0.05,
    unit: 'mg/L',
    range: [0, 0.3],
    optimal: [0, 0.1],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'nitrate',
    name: '硝酸盐',
    category: 'chemical',
    current: 45.0,
    unit: 'mg/L',
    range: [0, 50],
    optimal: [0, 40],
    status: 'warning',
    importance: 'high'
  },
  // 磷相关指标
  {
    id: 'total_phosphorus',
    name: '总磷',
    category: 'chemical',
    current: 0.1,
    unit: 'mg/L',
    range: [0, 0.2],
    optimal: [0, 0.1],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'phosphate',
    name: '磷酸盐',
    category: 'chemical',
    current: 0.15,
    unit: 'mg/L',
    range: [0, 0.3],
    optimal: [0, 0.15],
    status: 'good',
    importance: 'medium'
  },
  // 碳相关指标
  {
    id: 'doc',
    name: '溶解有机碳',
    category: 'chemical',
    current: 2.38,
    unit: 'mg/L',
    range: [0, 5.0],
    optimal: [0, 3.0],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'tc',
    name: '总碳',
    category: 'chemical',
    current: 20.0,
    unit: 'mg/L',
    range: [10, 30],
    optimal: [15, 25],
    status: 'good',
    importance: 'low'
  },
  {
    id: 'tic',
    name: '无机碳',
    category: 'chemical',
    current: 15.0,
    unit: 'mg/L',
    range: [5, 25],
    optimal: [10, 20],
    status: 'good',
    importance: 'low'
  },
  {
    id: 'toc',
    name: '总有机碳',
    category: 'chemical',
    current: 1.5,
    unit: 'mg/L',
    range: [0, 3.0],
    optimal: [0, 2.0],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'cod',
    name: '化学需氧量',
    category: 'chemical',
    current: 20.07,
    unit: 'mg/L',
    range: [15, 40],
    optimal: [15, 25],
    status: 'good',
    importance: 'high'
  },
  // 离子指标
  {
    id: 'chloride',
    name: '氯化物',
    category: 'chemical',
    current: 250,
    unit: 'mg/L',
    range: [0, 250],
    optimal: [0, 200],
    status: 'critical',
    importance: 'medium'
  },
  {
    id: 'sulfate',
    name: '硫酸盐',
    category: 'chemical',
    current: 125,
    unit: 'mg/L',
    range: [0, 250],
    optimal: [0, 200],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'hardness',
    name: '硬度',
    category: 'physical',
    current: 320.68,
    unit: 'mg/L',
    range: [150, 450],
    optimal: [200, 400],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'residual_chlorine',
    name: '余氯',
    category: 'chemical',
    current: 0.4,
    unit: 'mg/L',
    range: [0.3, 0.5],
    optimal: [0.3, 0.4],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'fluoride',
    name: '氟化物',
    category: 'chemical',
    current: 0.5,
    unit: 'mg/L',
    range: [0, 1.0],
    optimal: [0.3, 0.8],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'sulfide',
    name: '硫化物',
    category: 'chemical',
    current: 0.01,
    unit: 'mg/L',
    range: [0, 0.02],
    optimal: [0, 0.01],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'potassium',
    name: '钾离子',
    category: 'mineral',
    current: 6.0,
    unit: 'mg/L',
    range: [0, 12],
    optimal: [3, 9],
    status: 'good',
    importance: 'low'
  },
  // 重金属指标
  {
    id: 'zinc',
    name: '锌',
    category: 'metal',
    current: 0.5,
    unit: 'mg/L',
    range: [0, 1.0],
    optimal: [0, 0.8],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'cadmium',
    name: '镉',
    category: 'metal',
    current: 0.002,
    unit: 'mg/L',
    range: [0, 0.005],
    optimal: [0, 0.003],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'copper',
    name: '铜',
    category: 'metal',
    current: 0.5,
    unit: 'mg/L',
    range: [0, 1.0],
    optimal: [0, 0.8],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'manganese',
    name: '锰',
    category: 'metal',
    current: 0.05,
    unit: 'mg/L',
    range: [0, 0.1],
    optimal: [0, 0.07],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'aluminum',
    name: '铝',
    category: 'metal',
    current: 0.1,
    unit: 'mg/L',
    range: [0, 0.2],
    optimal: [0, 0.15],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'iron',
    name: '铁',
    category: 'metal',
    current: 0.15,
    unit: 'mg/L',
    range: [0, 0.3],
    optimal: [0, 0.2],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'chromium',
    name: '六价铬',
    category: 'metal',
    current: 0.025,
    unit: 'mg/L',
    range: [0, 0.05],
    optimal: [0, 0.035],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'ferrous_iron',
    name: '亚铁',
    category: 'metal',
    current: 0.15,
    unit: 'mg/L',
    range: [0, 0.3],
    optimal: [0, 0.2],
    status: 'good',
    importance: 'medium'
  },
  {
    id: 'arsenic',
    name: '砷',
    category: 'metal',
    current: 0.005,
    unit: 'mg/L',
    range: [0, 0.01],
    optimal: [0, 0.007],
    status: 'good',
    importance: 'high'
  },
  // 有机物指标
  {
    id: 'phenols',
    name: '酚类',
    category: 'organic',
    current: 0.001,
    unit: 'mg/L',
    range: [0, 0.002],
    optimal: [0, 0.001],
    status: 'good',
    importance: 'high'
  },
  {
    id: 'methanol',
    name: '甲醇',
    category: 'organic',
    current: 5.0,
    unit: 'mg/L',
    range: [0, 10],
    optimal: [0, 7],
    status: 'good',
    importance: 'medium'
  },
  // 硅相关指标
  {
    id: 'silicon_dioxide',
    name: '二氧化硅',
    category: 'mineral',
    current: 15.0,
    unit: 'mg/L',
    range: [1, 30],
    optimal: [5, 25],
    status: 'good',
    importance: 'low'
  },
  {
    id: 'soluble_silicon',
    name: '可溶性硅',
    category: 'mineral',
    current: 15.0,
    unit: 'mg/L',
    range: [5, 25],
    optimal: [10, 20],
    status: 'good',
    importance: 'low'
  },
  // 生物指标
  {
    id: 'chlorophyll',
    name: '叶绿素',
    category: 'biological',
    current: 15.3,
    unit: 'μg/L',
    range: [0, 30],
    optimal: [5, 20],
    status: 'good',
    importance: 'medium'
  }
];

// 定义useMonitoringData hook的返回类型
export interface MonitoringDataResult {
  parameters: WaterQualityParameter[];
  lastUpdated: Date;
  loading: boolean;
  error: Error | null;
}

/**
 * 获取水质监测数据的Hook
 */
export function useMonitoringData(): MonitoringDataResult {
  const [parameters, setParameters] = useState<WaterQualityParameter[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      setLoading(true);
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 使用模拟数据
        setParameters(mockParameters);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 设置定时刷新 (每60秒)
    const intervalId = setInterval(fetchData, 60000);

    // 清理函数
    return () => clearInterval(intervalId);
  }, []);

  return { parameters, lastUpdated, loading, error };
}