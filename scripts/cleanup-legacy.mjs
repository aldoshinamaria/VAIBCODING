import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexPath = path.join(root, 'index.html');
let text = fs.readFileSync(indexPath, 'utf8');

function removeBetween(startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  if (start < 0 || end < 0 || end <= start) {
    console.error('markers not found:', startMarker, start, end);
    process.exit(1);
  }
  text = text.slice(0, start) + text.slice(end);
  console.log('removed:', startMarker.trim());
}

removeBetween(
  '    <div class="legacy-projects-removed" hidden aria-hidden="true">',
  '    <!-- ========== Демо: интерактив (кейс-формат) ========== -->'
);
removeBetween(
  '    <!-- ========== Демо: интерактив (кейс-формат) ========== -->',
  '    <!-- ========== Быстрый старт 48h (entry) ========== -->'
);

fs.writeFileSync(indexPath, text, 'utf8');
console.log('cleanup done');
