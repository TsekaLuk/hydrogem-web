/* 
 * 用于执行复杂计算的Web Worker
 * 这使得计算不会阻塞主线程，保持UI响应性
 */

// 定义消息类型接口
interface WorkerMessage {
  type: string;
  data: any;
}

// 复杂计算示例 - 寻找大数组中的质数
function findPrimes(limit: number): number[] {
  const isPrime = Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) primes.push(i);
  }
  
  return primes;
}

// 计算大量数据的平均值、中位数等统计信息
function calculateStats(data: number[]): { 
  mean: number;
  median: number;
  min: number;
  max: number;
  sum: number;
  count: number;
} {
  const sorted = [...data].sort((a, b) => a - b);
  const count = data.length;
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;
  
  let median;
  if (count % 2 === 0) {
    median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  } else {
    median = sorted[Math.floor(count / 2)];
  }
  
  return {
    mean,
    median,
    min: sorted[0],
    max: sorted[count - 1],
    sum,
    count
  };
}

// 递归计算Fibonacci数列（性能不佳，但能演示复杂计算）
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 主消息处理器
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;
  let result;
  
  try {
    switch (type) {
      case 'findPrimes':
        result = findPrimes(data);
        break;
        
      case 'calculateStats':
        result = calculateStats(data);
        break;
        
      case 'fibonacci':
        result = fibonacci(data);
        break;
        
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// 确保TypeScript能够理解这是一个Web Worker模块
export {};
