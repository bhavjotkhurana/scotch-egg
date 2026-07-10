import { useMemo } from 'react';
import katex from 'katex';

export default function TeX({ value, block = false, className = '' }) {
  const html = useMemo(
    () =>
      katex.renderToString(value ?? '', {
        throwOnError: false,
        displayMode: block,
      }),
    [value, block]
  );

  const Tag = block ? 'div' : 'span';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
