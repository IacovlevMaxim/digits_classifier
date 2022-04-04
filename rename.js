const fs =  require('fs');

for(let i = 9; i < 10;i++) {
    let folder = `data_new/${i}/`;
    let j = 0;
    fs.readdirSync(folder).forEach(file => {
        fs.rename(`${folder}${file}`, `${folder}${i}-${j}.png`, (err) => {
            if (err) throw err;
        });
        j++;
    });
}
console.log('Rename complete!');