import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commonEn from '../locales/en/common.json';
import commonZh from '../locales/zh/common.json';
import dashboardEn from '../locales/en/dashboard.json';
import dashboardZh from '../locales/zh/dashboard.json';
import monitoringEn from '../locales/en/monitoring.json';
import monitoringZh from '../locales/zh/monitoring.json';
import helpEn from '../locales/en/help.json';
import helpZh from '../locales/zh/help.json';
import notificationsEn from '../locales/en/notifications.json';
import notificationsZh from '../locales/zh/notifications.json';

const resources = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    monitoring: monitoringEn,
    help: helpEn,
    notifications: notificationsEn
  },
  zh: {
    common: commonZh,
    dashboard: dashboardZh,
    monitoring: monitoringZh,
    help: helpZh,
    notifications: notificationsZh
  },
};

// 配置i18n但不立即初始化
i18n
  .use(LanguageDetector)
  .use(initReactI18next);

// 导出配置选项供main.tsx使用
export const i18nConfig = {
  resources,
  lng: localStorage.getItem('i18nextLng') || 'zh', // 使用保存的语言或默认为中文
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh'],
  ns: ['common', 'dashboard', 'monitoring', 'help', 'notifications'],
  defaultNS: 'common',
  fallbackNS: 'common',
  
  debug: true,
  
  interpolation: {
    escapeValue: false,
  },
  
  detection: {
    order: ['localStorage', 'querystring', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },

  react: {
    useSuspense: false,
  },
  
  // 确保资源加载完成
  initImmediate: false
};

// 监听语言变化
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  console.log('Available namespaces:', i18n.options.ns);
  console.log('Current translations:', i18n.getDataByLanguage(lng));
  document.documentElement.lang = lng;
  
  // 更新 localStorage
  localStorage.setItem('i18nextLng', lng);
});

// 添加调试事件监听
i18n.on('initialized', () => {
  console.log('i18n initialized with options:', i18n.options);
  console.log('Initial language:', i18n.language);
  console.log('Available resources:', i18n.options.resources);
});

i18n.on('loaded', (loaded) => {
  console.log('i18n resources loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('i18n failed loading:', { lng, ns, msg });
});

export default i18n;