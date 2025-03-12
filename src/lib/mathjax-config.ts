/**
 * Default MathJax 3 configuration
 * 适用于CDN加载的MathJax 3
 */
export const defaultMathJaxConfig = {
  loader: {
    load: ['input/tex-full', 'output/svg', '[tex]/ams', '[tex]/newcommand', '[tex]/configmacros']
  },
  tex: {
    packages: ['base', 'ams', 'newcommand', 'configmacros', 'autoload', 'require'],
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true,
    processRefs: true,
    digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
    tags: 'ams',
    tagSide: 'right',
    tagIndent: '0.8em',
    useLabelIds: true,
    multlineWidth: '85%',
    maxMacros: 1000,
    maxBuffer: 5 * 1024,
    macros: {
      // Common math operators
      '\\d': '\\mathrm{d}',
      '\\diff': '\\,\\mathrm{d}',
      '\\dx': '\\,\\mathrm{d}x',
      '\\dy': '\\,\\mathrm{d}y',
      '\\dz': '\\,\\mathrm{d}z',
      '\\dt': '\\,\\mathrm{d}t',
      
      // Common sets
      '\\R': '\\mathbb{R}',
      '\\N': '\\mathbb{N}',
      '\\Z': '\\mathbb{Z}',
      '\\Q': '\\mathbb{Q}',
      '\\C': '\\mathbb{C}',
      
      // Operators
      '\\Tr': '\\operatorname{Tr}',
      '\\Det': '\\operatorname{Det}',
      '\\Res': '\\operatorname{Res}',
      '\\Ker': '\\operatorname{Ker}',
      '\\Im': '\\operatorname{Im}',
      '\\Re': '\\operatorname{Re}',
      
      // Spacing
      ',\\': '{,\\,}',
      ', ': '{,\\;}',
      ',': '{,\\,}',
    }
  },
  svg: {
    fontCache: 'global',
    scale: 1,
    minScale: .5,
    matchFontHeight: true,
    mtextInheritFont: true,
    merrorInheritFont: true,
    mathmlSpacing: false,
    skipAttributes: {},
    exFactor: .5,
    displayAlign: 'center',
    displayIndent: '0',
  },
  options: {
    enableMenu: false,
    renderActions: {
      addMenu: [],
      checkLoading: [],
      addStyleSheet: []
    }
  },
  chtml: {
    // 添加CHTML输出选项，特别针对行内公式
    displayAlign: 'left',
    displayIndent: '0',
    matchFontHeight: true,
    mtextInheritFont: true,
    merrorInheritFont: true,
  },
  // 添加特定的行内公式渲染配置
  'HTML-CSS': {
    linebreaks: { automatic: false },
    styles: {
      ".MathJax_Display": { margin: "0" },
      ".MathJax": { 
        "vertical-align": "0",
        "display": "inline-block !important"
      }
    }
  },
  startup: {
    typeset: false,
    ready: function() {
      // 会被替换为自定义ready函数
    },
    pageReady: function() {
      // 页面准备好后的处理
      if (typeof window !== 'undefined' && window.MathJax && window.MathJax.startup && window.MathJax.startup.defaultPageReady) {
        return window.MathJax.startup.defaultPageReady();
      }
      return null;
    }
  }
};

// 为MathJax扩展Window接口
declare global {
  interface Window {
    MathJax: any;
  }
} 