import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf8');

// Extract all ids from index.html
const htmlIds = new Set([...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]));

console.log(`=== Total IDs found in index.html: ${htmlIds.size} ===`);

// Collect dynamic IDs generated inside JS files (e.g. innerHTML templates)
const jsFiles = fs.readdirSync('js').filter(f => f.endsWith('.js'));
const allIds = new Set(htmlIds);

for (const file of jsFiles) {
    const content = fs.readFileSync(path.join('js', file), 'utf8');
    const dynamicIds = [...content.matchAll(/id=["']([a-zA-Z0-9_\-]+)["']/g)].map(m => m[1]);
    for (const id of dynamicIds) allIds.add(id);
}

console.log(`=== Total IDs including JS templates: ${allIds.size} ===`);

// Check getElementById calls
for (const file of jsFiles) {
    const content = fs.readFileSync(path.join('js', file), 'utf8');
    const getElemCalls = [...content.matchAll(/document\.getElementById\(['"]([a-zA-Z0-9_\-]+)['"]\)/g)].map(m => m[1]);
    const missing = [];
    for (const id of getElemCalls) {
        if (!allIds.has(id)) {
            missing.push(id);
        }
    }
    if (missing.length > 0) {
        console.log(`⚠️ ${file} queries missing IDs:`, [...new Set(missing)]);
    } else {
        console.log(`✅ ${file}: all ${getElemCalls.length} queried IDs exist.`);
    }
}
