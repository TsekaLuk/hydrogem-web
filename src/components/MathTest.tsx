import React from 'react';
import { renderMarkdown } from '../lib/markdown';

const testMarkdown = `
# Math Rendering Test

## Simple Inline Math (KaTeX)
This is a simple inline equation: $E = mc^2$

## Simple Block Math (KaTeX)
Here's a simple block equation:
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## Complex Math (MathJax)
Here's a complex equation with cases:
$$
f(x) = \\begin{cases}
  \\frac{x^2}{2} & \\text{if } x \\geq 0 \\\\
  -\\frac{x^2}{2} & \\text{if } x < 0
\\end{cases}
$$

And here's a complex matrix:
$$
\\begin{pmatrix}
  a_{11} & a_{12} & \\cdots & a_{1n} \\\\
  a_{21} & a_{22} & \\cdots & a_{2n} \\\\
  \\vdots & \\vdots & \\ddots & \\vdots \\\\
  a_{m1} & a_{m2} & \\cdots & a_{mn}
\\end{pmatrix}
$$

## Complex Inline Math (MathJax)
Here's a complex inline equation with underbrace: $\\underbrace{x + y + z}_{\\text{sum}}$
`;

export function MathTest() {
  const [renderedContent, setRenderedContent] = React.useState<string>('');

  React.useEffect(() => {
    async function renderContent() {
      const rendered = await renderMarkdown(testMarkdown);
      setRenderedContent(rendered);
    }
    renderContent();
  }, []);

  return (
    <div className="math-test">
      <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </div>
  );
}

export default MathTest; 