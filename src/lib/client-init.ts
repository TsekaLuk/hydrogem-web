/**
 * 客户端初始化脚本
 * 处理页面加载后的动态功能初始化
 */

import { initMathJax } from './mathjax-init';

/**
 * 初始化页面上的所有MathJax元素
 */
export async function initPageMathJax() {
  try {
    // 加载MathJax
    const mathJax = await initMathJax();
    
    if (!mathJax) {
      console.warn('MathJax初始化失败');
      return;
    }
    
    // 查找所有需要MathJax渲染的元素
    const displayElements = document.querySelectorAll('.math-display-mathjax');
    const inlineElements = document.querySelectorAll('.math-inline-mathjax');
    
    if (displayElements.length > 0 || inlineElements.length > 0) {
      console.log(`找到${displayElements.length}个块级公式和${inlineElements.length}个行内公式等待渲染`);
      
      // 渲染所有公式
      await mathJax.typesetPromise([...displayElements, ...inlineElements]);
      console.log('MathJax渲染完成');
    }
  } catch (error) {
    console.error('MathJax初始化或渲染失败:', error);
  }
}

/**
 * 页面初始化函数
 * 在页面加载完成后执行
 */
export function initClientFeatures() {
  // 初始化MathJax
  initPageMathJax();
  
  // 添加DOM变化监听，处理动态加载的内容
  const observer = new MutationObserver(async (mutations) => {
    let hasMathContent = false;
    
    // 检查变化中是否有数学内容
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLElement) {
            const mathElements = node.querySelectorAll('.math-display-mathjax, .math-inline-mathjax');
            if (mathElements.length > 0) {
              hasMathContent = true;
              break;
            }
          }
        }
      }
      
      if (hasMathContent) break;
    }
    
    // 如果发现数学内容，重新渲染
    if (hasMathContent) {
      await initPageMathJax();
    }
  });
  
  // 监视文档变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return () => {
    // 返回清理函数
    observer.disconnect();
  };
}

// 如果是浏览器环境，在DOM加载完成后初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClientFeatures);
  } else {
    initClientFeatures();
  }
} 