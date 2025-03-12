import { defaultMathJaxConfig } from './mathjax-config';

// Store MathJax instance
let mathJaxInstance: any = null;
let initialized = false;

/**
 * Initialize MathJax using the component-based approach
 */
export async function initMathJax(): Promise<any> {
  if (initialized && mathJaxInstance) {
    return mathJaxInstance;
  }

  return new Promise((resolve, reject) => {
    try {
      // Only load MathJax in the browser environment
      if (typeof window === 'undefined') {
        return resolve(null);
      }

      // Create script element to load MathJax
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      script.async = true;
      
      // Configure MathJax before loading
      window.MathJax = {
        ...defaultMathJaxConfig,
        startup: {
          ...defaultMathJaxConfig.startup,
          ready: () => {
            // Execute the default startup ready function
            window.MathJax.startup.defaultReady();
            // Mark as initialized
            initialized = true;
            // Store the MathJax instance
            mathJaxInstance = window.MathJax;
            // Resolve the promise
            resolve(window.MathJax);
          }
        }
      };
      
      // Handle loading error
      script.onerror = (err) => {
        console.error('Error loading MathJax:', err);
        reject(err);
      };
      
      // Add script to document
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error initializing MathJax:', error);
      reject(error);
    }
  });
}

/**
 * Render math content using MathJax
 */
export async function renderMathJax(content: string): Promise<string> {
  try {
    const mjInstance = await initMathJax();
    if (!mjInstance) {
      return content;
    }
    
    // Create temporary container
    const container = document.createElement('div');
    container.innerHTML = content;
    
    // Typeset the container
    await mjInstance.typesetPromise([container]);
    
    // Return the HTML with rendered math
    return container.innerHTML;
  } catch (error) {
    console.error('Error rendering MathJax:', error);
    return content;
  }
} 