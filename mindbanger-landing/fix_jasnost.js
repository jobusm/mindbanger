const fs = require('fs');

const run = (file, replacements) => {
    let str = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        str = str.split(search).join(replace);
    }
    fs.writeFileSync(file, str, 'utf8');
};

run('src/dictionaries/sk.json', [
    ['"Denné nastavenie mysle pre jasnosť, pokoj a sústredenie."', '"Denné nastavenie mysle pre intuíciu, pokoj a sústredenie."'],
    ['jasnosti', 'intuície'],
    ['k intuície', 'k intuícii'],
    ['Jasnosť', 'Intuícia'],
    ['jasnosťou', 'intuíciou'],
    ['jasnosť', 'intuícia'],
    ['pre intuícia', 'pre intuíciu']
]);

run('src/dictionaries/cs.json', [
    ['"title": "Předplať si denní mentální jasnost",', '"title": "Předplať si denní mentální intuici",'],
    ['jasnosti', 'intuice'],
    ['k intuice', 'k intuici'],
    ['Jasnost', 'Intuice'],
    ['jasností', 'intuicí'],
    ['jasnost', 'intuice'],
    ['pro intuice', 'pro intuici']
]);

console.log('done');