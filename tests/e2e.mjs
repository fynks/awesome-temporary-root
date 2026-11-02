// End-to-end check: fetches data from the local server exactly like the
// browser does, then runs the compatibility checker on real payloads.
import { checkCompatibility } from '../website/js/compatibility.js';

const base = 'http://localhost:8766';
const [devices, modules] = await Promise.all([
  (await fetch(`${base}/data/devices.json`)).json(),
  (await fetch(`${base}/data/modules.json`)).json(),
]);

console.log(`loaded ${devices.length} devices, ${modules.length} modules`);

const cases = [
  { label: 'exact match (S24 Ultra)', args: ['SM-S928B', 'S928BXXS6DZF2', '6.1.145'], expect: 'exact_match' },
  { label: 'partial (model only)', args: ['SM-S928B', 'nope', 'nope'], expect: 'partial_match' },
  { label: 'no match', args: ['SM-NOPE', 'nope', 'nope'], expect: 'no_match' },
];

let failed = 0;
for (const c of cases) {
  const result = checkCompatibility(devices, ...c.args);
  const ok = result.type === c.expect;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.label} -> ${result.type}${result.status ? ` (${result.status})` : ''}`);
}

if (failed) process.exit(1);
console.log('E2E: all cases pass');
