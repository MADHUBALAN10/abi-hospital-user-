const fs = require('fs');
const path = require('path');

const replacement = "const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : 'https://abi-hospital-backend.onrender.com/api';";

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = content;

            // Replace const API_URL
            modified = modified.replace(
                /const API_URL\s*=\s*['"]https:\/\/abi-hospital-backend\.onrender\.com\/api['"];/g,
                replacement
            );

            // Handle hardcoded strings
            if (modified.includes('https://abi-hospital-backend.onrender.com/api')) {
                if (!modified.includes('const API_URL')) {
                    modified = modified.replace(/import axios from ['"]axios['"];/, `import axios from 'axios';\n\n${replacement}`);
                }
                
                // For strings with single/double quotes, turn them into template literals
                modified = modified.replace(
                    /['"]https:\/\/abi-hospital-backend\.onrender\.com\/api\/(.*?)['"]/g,
                    '`${API_URL}/$1`'
                );
                
                // For template literals
                modified = modified.replace(
                    /`https:\/\/abi-hospital-backend\.onrender\.com\/api\/(.*?)`/g,
                    '`${API_URL}/$1`'
                );
            }

            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

walkDir('c:/Users/madhu/Music/abi-hospital/client/src');
walkDir('c:/Users/madhu/Music/abi-hospital/admin/src');
console.log('Done!');
