const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');

const replacements = {
    // Hex Colors
    '#3b82f6': '#088395', // Primary
    '#a855f7': '#7AB2B2', // Secondary
    '#ec4899': '#EBF4F6', // Tertiary
    '#60a5fa': '#7AB2B2', // Light Primary
    '#0a0a0f': '#09637E', // Background
    '#0f0f18': '#086C8A', // Background slightly lighter
    '#161625': '#087A99', // Background lighter

    // RGB Arrays (for search/replace)
    'rgba(59,130,246,': 'rgba(8,131,149,', // Primary RGB
    'rgba(168,85,247,': 'rgba(122,178,178,', // Secondary RGB
    'rgba(10,10,15,': 'rgba(9,99,126,', // Dark BG
    'rgba(15,15,24,': 'rgba(9,99,126,', // Dark BG 2
};

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;

            for (const [key, value] of Object.entries(replacements)) {
                content = content.split(key).join(value);
            }

            // Also handle index.css variables specifically
            if (filePath.endsWith('index.css')) {
                content = content.replace('--color-dark-950: #0a0a0f;', '--color-dark-950: #09637E;');
                content = content.replace('--color-dark-900: #0f0f18;', '--color-dark-900: #086C8A;');
                content = content.replace('--color-dark-800: #161625;', '--color-dark-800: #087A99;');
                content = content.replace('--color-dark-700: #1e1e32;', '--color-dark-700: #088395;');
                content = content.replace('--color-dark-600: #2a2a40;', '--color-dark-600: #7AB2B2;');
                // Change text colors to #EBF4F6 base
                content = content.replace('--color-text-primary: rgba(255, 255, 255, 0.95);', '--color-text-primary: #EBF4F6;');
                content = content.replace('--color-text-secondary: rgba(255, 255, 255, 0.70);', '--color-text-secondary: rgba(235, 244, 246, 0.80);');
                content = content.replace('--color-text-muted: rgba(255, 255, 255, 0.50);', '--color-text-muted: rgba(235, 244, 246, 0.50);');
            }

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

processDirectory(directoryPath);
console.log('Color updates complete.');
