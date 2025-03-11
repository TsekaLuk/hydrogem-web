import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import i18n, { i18nConfig } from './lib/i18n';
import { updateInitialMessage } from './lib/constants';
import { InitOptions } from 'i18next';
import { TooltipProvider } from './components/ui/tooltip';

// 使用导出的配置初始化i18n
i18n.init(i18nConfig as InitOptions).then(() => {
  console.log('i18n initialization complete');
  console.log('Current language:', i18n.language);
  
  // Set initial message after i18n is initialized
  updateInitialMessage(i18n.t('chat.initialMessage'));
  
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TooltipProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </TooltipProvider>
    </React.StrictMode>
  );
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
  // 即使i18n初始化失败也渲染应用，使用默认语言
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TooltipProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </TooltipProvider>
    </React.StrictMode>
  );
});
