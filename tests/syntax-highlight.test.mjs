import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlightCode } from '../src/app/shared/syntax-highlight.ts';

test('destaca palabras reservadas de Java y mantiene los saltos', () => {
  const html = highlightCode('record Book(String title) {\n  return null;\n}', 'java');
  assert.match(html, /syntax-keyword.*record/);
  assert.match(html, /syntax-keyword.*return/);
  assert.match(html, /\n/);
});

test('escapa HTML y no permite inyectar scripts por el banco de preguntas', () => {
  const html = highlightCode('<script>alert("hola")</script>', 'java');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('syntax-string'));
});

test('destaca comentarios y comandos Git', () => {
  const html = highlightCode('git status -sb\n# comentario', 'bash');
  assert.ok(html.includes('syntax-keyword')); assert.ok(html.includes('syntax-comment'));
});
