/**
 * Web Worker 管理器 - 用于处理复杂计算，避免阻塞主线程
 * 
 * 使用方法:
 * 1. 创建单独的worker文件 (worker.ts):
 *    self.onmessage = (e) => {
 *      const result = complexCalculation(e.data);
 *      self.postMessage(result);
 *    };
 * 
 * 2. 使用WorkerManager:
 *    const workerManager = new WorkerManager('path/to/worker.ts');
 *    
 *    workerManager.runTask(data)
 *      .then(result => console.log(result))
 *      .catch(error => console.error(error));
 */

type WorkerStatus = 'idle' | 'busy';

interface TaskQueue<T, R> {
  data: T;
  resolve: (value: R | PromiseLike<R>) => void;
  reject: (reason?: any) => void;
}

export class WorkerManager<T = any, R = any> {
  private worker: Worker | null = null;
  private status: WorkerStatus = 'idle';
  private taskQueue: TaskQueue<T, R>[] = [];
  private workerURL: string;
  
  constructor(workerURL: string) {
    this.workerURL = workerURL;
    this.initWorker();
  }
  
  private initWorker() {
    try {
      this.worker = new Worker(this.workerURL, { type: 'module' });
      
      this.worker.onmessage = (e: MessageEvent) => {
        const currentTask = this.taskQueue.shift();
        if (currentTask) {
          currentTask.resolve(e.data);
          this.processNextTask();
        }
      };
      
      this.worker.onerror = (e: ErrorEvent) => {
        const currentTask = this.taskQueue.shift();
        if (currentTask) {
          currentTask.reject(new Error(`Worker error: ${e.message}`));
          this.processNextTask();
        }
      };
      
      this.status = 'idle';
    } catch (error) {
      console.error('Failed to initialize Web Worker:', error);
      
      // 回退到主线程处理
      this.worker = null;
    }
  }
  
  /**
   * 在Worker中运行任务
   * @param data 要传递给Worker的数据
   * @returns 返回Promise，包含Worker处理后的结果
   */
  public runTask(data: T): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      // 如果Worker创建失败，回退到主线程处理
      if (!this.worker) {
        // 这里需要有一个回退到主线程处理的实现
        reject(new Error('Web Worker not available, implement fallback'));
        return;
      }
      
      // 添加任务到队列
      this.taskQueue.push({ data, resolve, reject });
      
      // 如果Worker空闲，处理任务
      if (this.status === 'idle') {
        this.processNextTask();
      }
    });
  }
  
  private processNextTask() {
    if (this.taskQueue.length > 0 && this.worker) {
      this.status = 'busy';
      const task = this.taskQueue[0];
      this.worker.postMessage(task.data);
    } else {
      this.status = 'idle';
    }
  }
  
  /**
   * 终止Worker
   */
  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // 拒绝所有待处理的任务
    this.taskQueue.forEach(task => {
      task.reject(new Error('Worker terminated'));
    });
    
    this.taskQueue = [];
  }
  
  /**
   * 检查浏览器是否支持Web Workers
   */
  public static isSupported(): boolean {
    return typeof Worker !== 'undefined';
  }
}

/**
 * 使用示例:
 * 
 * // 创建一个示例的Worker文件 (src/workers/example.worker.ts)
 * // 然后使用以下代码:
 * 
 * const exampleWorker = new WorkerManager<number[], number>('/src/workers/example.worker.ts');
 * 
 * exampleWorker.runTask([1, 2, 3, 4, 5])
 *   .then(result => console.log('Processed result:', result))
 *   .catch(error => console.error('Error processing task:', error));
 * 
 * // 在不再需要Worker时终止它
 * // exampleWorker.terminate();
 */
