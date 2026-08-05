import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in (node as any)) {
    return extractText((node as any).props.children);
  }
  return '';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h1 id={id} className="mt-24 mb-8 scroll-mt-28 text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance text-slate-900 dark:text-slate-100">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h2 id={id} className="mt-32 md:mt-40 mb-6 scroll-mt-28 text-3xl md:text-4xl font-semibold tracking-tight text-balance text-slate-900 dark:text-slate-100">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(extractText(children));
      return (
        <h3 id={id} className="mt-12 mb-3 scroll-mt-28 text-xl md:text-2xl font-medium tracking-tight text-slate-800 dark:text-slate-200">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="mb-6 text-base/[1.7] md:text-lg/[1.7] text-slate-700 dark:text-slate-300">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-slate-900 dark:text-slate-100 underline decoration-slate-400/60 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 marker:text-slate-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 marker:text-slate-500">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-slate-300 dark:border-slate-600 pl-6 italic text-slate-600 dark:text-slate-400">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:text-slate-200">
        {children}
      </code>
    ),
    hr: () => <hr className="my-16 border-slate-200 dark:border-slate-800" />,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        width={1200}
        height={800}
        {...(props as ImageProps)}
        alt={props.alt ?? ''}
      />
    ),
    ...components,
  };
}
