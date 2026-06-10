import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexPath = path.join(root, 'index.html');
let text = fs.readFileSync(indexPath, 'utf8');

const sections = [
  ['    <!-- ========== Витрина возможностей: «Представьте, что…» ========== -->', '    <!-- ========== Навигатор задач: «Что вы хотите решить?» ========== -->'],
  ['    <!-- ========== Навигатор задач: «Что вы хотите решить?» ========== -->', '    <!-- ========== Цифровой помощник: подбор решения ========== -->'],
  ['    <!-- ========== Цифровой помощник: подбор решения ========== -->', '    <!-- ========== Каталог цифровых продуктов ========== -->'],
  ['    <!-- ========== Быстрый старт 48h (entry) ========== -->', '    <!-- ========== Какое решение может подойти именно вам ========== -->'],
  ['    <!-- ========== Какое решение может подойти именно вам ========== -->', '    <!-- ========== Стоимость: тарифы ========== -->'],
];

for (const [startMarker, endMarker] of sections) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start < 0 || end < 0 || end <= start) {
    console.error('not found:', startMarker.slice(0, 50), start, end);
    process.exit(1);
  }
  text = text.slice(0, start) + text.slice(end);
  console.log('removed:', startMarker.match(/= (.+) =/)?.[1] || startMarker.slice(0, 40));
}

// nav
text = text.replace(
  '<a href="#offers">Форматы</a>\n          <a href="#projects">Решения</a>',
  '<a href="#projects">Продукты</a>'
);

// drop unused imagine.css
text = text.replace('  <link rel="stylesheet" href="assets/css/imagine.css" />\n', '');

// accordion init — only prod-card remains in use
text = text.replace("      initAccordion('.solution__head', '.solution');\n", '');
text = text.replace("      initAccordion('.need__head', '.need');\n", '');
text = text.replace("      initAccordion('.imagine__head', '.imagine-card');\n", '');

// resize handler
text = text.replace(
  "document.querySelectorAll('.solution.is-open .solution__panel, .need.is-open .need__panel, .imagine-card.is-open .imagine-card__panel, .prod-card.is-open .prod-card__panel')",
  "document.querySelectorAll('.prod-card.is-open .prod-card__panel')"
);

// advisor JS block
const advisorStart = text.indexOf('      /* ----- Цифровой помощник: подбор решения ----- */');
const advisorEnd = text.indexOf('      window.addEventListener(\'resize\'', advisorStart);
if (advisorStart >= 0 && advisorEnd > advisorStart) {
  text = text.slice(0, advisorStart) + text.slice(advisorEnd);
  console.log('removed: advisor JS');
}

fs.writeFileSync(indexPath, text, 'utf8');
console.log('dedupe done');
