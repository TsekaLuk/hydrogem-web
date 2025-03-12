import KatexRenderer from './KatexRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function KatexDemo() {
  // Examples of various math expressions
  const mathExamples = [
    {
      title: '简单数学公式',
      expression: 'E = mc^2',
      displayMode: false,
    },
    {
      title: '二次方程公式',
      expression: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      displayMode: true,
    },
    {
      title: '矩阵示例',
      expression: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
      displayMode: true,
    },
    {
      title: '积分示例',
      expression: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)',
      displayMode: true,
    },
    {
      title: '水质相关公式',
      expression: 'pH = -\\log_{10}[H^+]',
      displayMode: true,
    },
    {
      title: '化学反应方程式',
      expression: 'H_2O + CO_2 \\rightleftharpoons H_2CO_3',
      displayMode: true,
    },
    {
      title: '复杂的数学符号',
      expression: '\\frac{1}{\\Bigg(\\sqrt{\\phi \\sqrt{5}}-\\phi\\Bigg) e^{\\frac25 \\pi}} = 1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}} {1+\\frac{e^{-8\\pi}} {1+\\ldots} } } }',
      displayMode: true,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>KaTeX 数学公式渲染演示</CardTitle>
        <CardDescription>
          HydroGem 支持在聊天中使用 LaTeX 数学公式。使用 $ 符号包裹行内公式，使用 $$ 符号包裹块级公式。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mathExamples.map((example, index) => (
          <div key={index} className="p-4 border rounded-lg bg-background/50">
            <h3 className="text-md font-medium mb-2">{example.title}</h3>
            <div className="mb-2 text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
              {example.displayMode ? `$$${example.expression}$$` : `$${example.expression}$`}
            </div>
            <div className={example.displayMode ? 'flex justify-center' : ''}>
              <KatexRenderer
                math={example.expression}
                displayMode={example.displayMode}
                className={example.displayMode ? 'my-4' : 'inline'}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 