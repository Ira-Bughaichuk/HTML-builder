const fs = require('fs');
const path = require('path');


const ws = fs.createWriteStream(path.join(__dirname, 'new-text.txt'), { flags: 'a' });
const rs = fs.createReadStream(path.join(__dirname, 'new-text.txt'), { encoding: 'utf-8' });

ws.write('Hello, it is new text ! ');
ws.write('All are good now !');
ws.end();


rs.on('data', (chunk) => {
    console.log(chunk.toString());
});

rs.on('error', (err) => {
    console.error(`Error reading file: ${err}`);
}); 

rs.on('end', () => {
    console.log('Writing finished');
}); 

  // rr.pipe(ws);