/**
 * 格式化数字，保留指定位数的小数
 * @param value 要格式化的数字
 * @param digits 小数位数，默认为2
 * @returns 格式化后的字符串
 */
export function formatNumber(value: number, digits: number = 2): string {
  return value.toFixed(digits);
}

/**
 * 格式化日期时间
 * @param date 日期对象
 * @returns 格式化后的字符串，格式：YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * 格式化百分比
 * @param value 小数值
 * @param digits 小数位数，默认为1
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, digits: number = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/**
 * 格式化范围值
 * @param min 最小值
 * @param max 最大值
 * @param unit 单位
 * @returns 格式化后的范围字符串
 */
export function formatRange(min: number, max: number, unit: string = ''): string {
  return `${formatNumber(min)}${unit} - ${formatNumber(max)}${unit}`;
}

/**
 * 格式化趋势变化
 * @param direction 趋势方向
 * @param percentage 变化百分比
 * @returns 格式化后的趋势字符串
 */
export function formatTrend(direction: 'up' | 'down', percentage: number): string {
  const symbol = direction === 'up' ? '↑' : '↓';
  return `${symbol} ${formatPercentage(percentage)}`;
} 