const JAVA_WORDS = 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public record return sealed permits non-sealed short static strictfp super switch synchronized this throw throws transient try var void volatile while yield true false null'.split(' ');
const JAVA_KEYWORDS = new Set(JAVA_WORDS);
const SHELL_WORDS = new Set(['git', 'npm', 'npx', 'java', 'javac', 'cd', 'node', 'mvn', 'echo']);
const TOKEN = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[a-zA-Z_][\w]*|\b[a-zA-Z_][\w-]*\b|\b\d+(?:\.\d+)?\b/g;
const escapeHtml = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export function highlightCode(source: string, language: string): string {
  const code = source ?? '';
  let result = '';
  let position = 0;
  for (const match of code.matchAll(TOKEN)) {
    const token = match[0];
    const start = match.index;
    result += escapeHtml(code.slice(position, start));
    let name = '';
    if (token.startsWith('//') || token.startsWith('/*') || (language !== 'java' && token.startsWith('#'))) name = 'comment';
    else if (token.startsWith('"') || token.startsWith("'")) name = 'string';
    else if (/^\d/.test(token)) name = 'number';
    else if (token.startsWith('@')) name = 'annotation';
    else if (language === 'java' && JAVA_KEYWORDS.has(token)) name = 'keyword';
    else if (language !== 'java' && SHELL_WORDS.has(token)) name = 'keyword';
    result += name ? `<span class="syntax-${name}">${escapeHtml(token)}</span>` : escapeHtml(token);
    position = start + token.length;
  }
  return result + escapeHtml(code.slice(position));
}

