import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexPath = path.join(root, 'index.html');
const snippetPath = path.join(root, 'assets/html/portfolio-section.html');

const text = fs.readFileSync(indexPath, 'utf8');
const snippet = fs.readFileSync(snippetPath, 'utf8');
const start = text.indexOf('    <!-- ========== Кейсы: доказательство результата ========== -->');
const end = text.indexOf('    <!-- ========== Блок доверия ========== -->');
if (start < 0 || end < 0) {
  console.error('markers not found', start, end);
  process.exit(1);
}
const out = text.slice(0, start) + snippet + text.slice(end);
fs.writeFileSync(indexPath, out, 'utf8');
console.log('done');
