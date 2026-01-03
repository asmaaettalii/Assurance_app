const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    // Read raw buffer
    const buffer = fs.readFileSync(envPath);

    // Convert to string and clean up
    let content = buffer.toString('utf8');

    // If it was UTF-16LE (PowerShell default), it might look like "V\x00I\x00T\x00E..."
    // or sometimes fs.readFileSync reads it weird if BOM is present.
    // Let's try to just scrub it clean.

    // Regex to basic alphanumeric + = . _ - 
    // This is destructive if the key contains special chars, but JWTs are usually base64url safe.
    // Better: just trim whitespace and ensuring it starts with VITE_PINATA_JWT

    const lines = content.split(/\r?\n/);
    const keyLine = lines.find(l => l.includes('VITE_PINATA_JWT'));

    if (keyLine) {
        // Remove null bytes if any
        let cleanLine = keyLine.replace(/\0/g, '').trim();
        // Remove BOM if any
        cleanLine = cleanLine.replace(/^\uFEFF/, '');

        fs.writeFileSync(envPath, cleanLine, { encoding: 'utf8' });
        console.log('SUCCESS: .env file rewritten as UTF-8');
        console.log('Content preview:', cleanLine.substring(0, 20) + '...');
    } else {
        console.log('ERROR: VITE_PINATA_JWT not found in file (or encoding is extremely weird)');
        console.log('Raw buffer length:', buffer.length);
    }

} catch (err) {
    console.error('Error repairing file:', err);
}
