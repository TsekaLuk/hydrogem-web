import { useCallback } from 'react';
import { WaterQualityParameter } from '../types/parameters';

/**
 * 钩子函数，提供将水质参数信息插入到聊天框的功能
 * @returns 插入参数信息的回调函数
 */
export function useInsertParameterToChat() {
  return useCallback((param: WaterQualityParameter) => {
    console.log('useInsertParameterToChat被调用', param);
    
    try {
      const input = document.querySelector('textarea#message-input, textarea') as HTMLTextAreaElement | null;
      if (!input) {
        console.error('找不到聊天输入框元素!');
        return;
      }
      
      const paramName = param.name === 'pH值' ? 'pH值' : param.name;
      const template = `当前${paramName}为 ${param.current}${param.unit || ''}，状态：${
        param.status === 'good' ? '正常' : 
        param.status === 'warning' ? '警告' : 
        param.status === 'critical' ? '异常' : '未知'
      }${param.range ? `，正常范围：${param.range[0]}-${param.range[1]}${param.unit || ''}` : ''}。`;
      
      const currentValue = input.value;
      input.value = currentValue ? `${currentValue}\n${template}` : template;
      
      // 尝试聚焦和触发输入事件
      input.focus();
      
      // 触发输入事件，以便React组件能够捕获值的变化
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      console.log('参数信息已添加到聊天框');
    } catch (error) {
      console.error('添加参数信息到聊天框时出错:', error);
    }
  }, []);
} 