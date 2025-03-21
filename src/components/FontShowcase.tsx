import React from 'react';
import { cn } from '@/lib/utils';

export const FontShowcase: React.FC = () => {
  return (
    <div className="h-full space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">HydroGem Web 字体方案</h1>
        <p className="text-muted-foreground">根据21st.dev产品设计规范，实现精简而高效的字体组合</p>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">字体组合概览 (4种字体类型)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">中文字体</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-40 text-sm text-muted-foreground">阿里巴巴普惠体-2</span>
                <span className="font-alibaba text-xl">智能对话助手</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm text-muted-foreground">IBM Plex Sans TC</span>
                <span className="font-ibm-plex text-xl">智能对话助手</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">英文字体</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-40 text-sm text-muted-foreground">Apoc Normal Trial</span>
                <span className="font-apoc text-xl">AI Assistant</span>
              </div>
              <div className="flex items-center">
                <span className="w-40 text-sm text-muted-foreground">Indecisive Sans Trial</span>
                <span className="font-indecisive text-xl">AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">主要标题样式</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 p-4 bg-background/50 rounded-md">
            <div>
              <h3 className="text-lg font-medium mb-3">中文标题</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">主标题 (AlibabaPuHuiTi-2-85-Bold)</span>
                  <h1 className="font-alibaba font-bold text-2xl">智能对话助手界面</h1>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">次级标题 (AlibabaPuHuiTi-2-75-SemiBold)</span>
                  <h2 className="font-alibaba font-semibold text-xl">数据分析与可视化</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 p-4 bg-background/50 rounded-md">
            <div>
              <h3 className="text-lg font-medium mb-3">英文标题</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">主标题 (Apoc-Normal-Trial-Bold)</span>
                  <h1 className="font-apoc font-bold text-2xl">AI Analytics Dashboard</h1>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">次级标题 (Apoc-Normal-Trial-Regular)</span>
                  <h2 className="font-apoc text-xl">Performance Insights</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">正文与功能性文本</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">中文正文 (AlibabaPuHuiTi-2-55-Regular)</h3>
            <p className="font-alibaba">
              HydroGem 是一个高度智能的对话助手，能够理解复杂的问题并提供详细的解答。它采用了最新的自然语言处理技术，能够进行多轮对话，记住上下文内容，并根据用户的需求提供个性化的回答。
            </p>
            <div className="mt-4">
              <h4 className="text-base font-medium mb-2">中文强调 (AlibabaPuHuiTi-2-65-Medium)</h4>
              <p className="font-alibaba">
                普通文本中的<span className="font-alibaba font-medium">重点内容</span>可以使用中等字重来强调，使其在视觉上更加突出。
              </p>
            </div>
          </div>
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">英文正文 (Indecisive Sans Trial-Regular)</h3>
            <p className="font-indecisive">
              HydroGem is a highly intelligent conversational assistant capable of understanding complex questions and providing detailed answers. It leverages the latest natural language processing technology to engage in multi-turn conversations, remember context, and deliver personalized responses based on user needs.
            </p>
            <div className="mt-4">
              <h4 className="text-base font-medium mb-2">英文强调 (Indecisive Sans Trial-SemiBold)</h4>
              <p className="font-indecisive">
                Regular text with <span className="font-indecisive font-semibold">important content</span> can be emphasized using semi-bold weight to make it visually stand out.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">代码与辅助内容</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium mb-2">代码展示</h3>
            <div className="bg-background/80 p-3 rounded border border-border/40">
              <pre className="font-mono text-sm">
                <code>
                  <span className="font-ibm-plex font-medium">// 中文代码注释 (IBM Plex Sans TC-Medium)</span>
                  {"\n"}const message = "HydroGem AI";
                  {"\n"}console.log("Hello from HydroGem AI");
                </code>
              </pre>
            </div>
          </div>
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium mb-2">辅助内容</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-1">中文辅助文本 (IBM Plex Sans TC-Light)</h4>
                <p className="font-ibm-plex font-light text-sm text-muted-foreground">
                  这是一段辅助说明文字，用于提供额外的信息或说明，通常使用较小的字号和较轻的字重。
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">英文辅助文本 (Indecisive Sans Trial-Light)</h4>
                <p className="font-indecisive font-light text-sm text-muted-foreground">
                  This is auxiliary text used to provide additional information or instructions, typically displayed in a smaller size and lighter weight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">混合语言内容</h2>
        <div className="space-y-6">
          <div className="p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium mb-3">中英文混排示例</h3>
            <p className="font-alibaba">
              HydroGem AI 智能对话助手（<span className="font-indecisive">AI Conversational Assistant</span>）是基于大型语言模型（<span className="font-indecisive">Large Language Model, LLM</span>）开发的新一代人工智能产品，它能够理解、生成和优化各类文本内容。
            </p>
          </div>
          <div className="p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium mb-3">中英文标题组合</h3>
            <div className="space-y-2">
              <h2 className="font-alibaba font-bold text-xl">智能分析平台 <span className="font-apoc">Analytics Platform</span></h2>
              <h3 className="font-alibaba font-semibold text-lg">数据可视化 <span className="font-apoc">Data Visualization</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">特殊用例</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium mb-3">品牌标语 (Apoc Normal Trial)</h3>
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg">
              <p className="font-apoc text-4xl tracking-tight text-blue-600 dark:text-blue-400">
                HYDROGEM
              </p>
              <p className="font-apoc text-xl mt-2 text-blue-500 dark:text-blue-300">
                The Future of Conversation
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">注：Apoc字体仅用于品牌标语的超大字号(&gt;48px)展示</p>
          </div>
        </div>
      </div>

      <div className="bg-card p-5 rounded-lg shadow-sm border border-border/30">
        <h2 className="text-2xl font-semibold mb-4">响应式字体设计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">移动设备优化</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">在小屏幕设备上，字体大小和行高自动调整以保证良好的可读性：</p>
              <div className="p-3 border border-dashed border-border rounded-md max-w-xs mx-auto">
                <h4 className="font-alibaba font-semibold text-base">移动端标题示例</h4>
                <p className="font-alibaba text-sm mt-1">
                  这是移动端上的正文文本，使用了更紧凑的布局和适当的字号。
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4 p-4 bg-background/50 rounded-md">
            <h3 className="text-lg font-medium">打印媒体优化</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">针对打印场景，字体选择和大小做了专门优化：</p>
              <div className="p-3 border border-dashed border-border rounded-md">
                <h4 className="font-ibm-plex font-medium text-base">打印文档标题</h4>
                <p className="font-ibm-plex text-sm mt-1">
                  这是针对打印优化的文本，使用了更高对比度和更清晰的字体。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontShowcase; 