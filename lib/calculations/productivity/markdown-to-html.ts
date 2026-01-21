/**
 * Markdown to HTML Converter
 * 
 * Convert Markdown text to HTML.
 * 
 * @module lib/calculations/productivity/markdown-to-html
 */

export interface MarkdownInputs {
    markdown: string;
}

export interface MarkdownResults {
    html: string;
    preview: string;
}

/**
 * Simple Markdown to HTML converter
 * Supports: headers, bold, italic, links, images, code, lists, blockquotes
 */
export function convertMarkdownToHtml(markdown: string): string {
    if (!markdown.trim()) return '';

    let html = markdown;

    // Escape HTML entities first (except for our own tags)
    html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Headers (h1-h6)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Strikethrough (~~text~~)
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Code blocks (```code```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Blockquotes (> text)
    html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules (---, ***, ___)
    html = html.replace(/^([-*_]){3,}$/gm, '<hr>');

    // Unordered lists (* item or - item)
    html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists (1. item)
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Line breaks (two spaces at end of line or empty line)
    html = html.replace(/  \n/g, '<br>\n');

    // Paragraphs (wrap remaining text blocks)
    html = html.replace(/^(?!<[hupob]|<li|<hr|<pre)(.+)$/gm, '<p>$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    // Clean up nested blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    return html.trim();
}

/**
 * Convert markdown to results
 */
export function convertMarkdown(inputs: MarkdownInputs): MarkdownResults {
    const html = convertMarkdownToHtml(inputs.markdown);

    return {
        html,
        preview: html,
    };
}

/**
 * Example markdown for demonstration
 */
export const MARKDOWN_EXAMPLE = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text** and *italic text*.

Here is a [link](https://example.com) and an image:

![Alt text](https://via.placeholder.com/150)

> This is a blockquote

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

Inline \`code\` example.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

---

~~Strikethrough text~~
`;
