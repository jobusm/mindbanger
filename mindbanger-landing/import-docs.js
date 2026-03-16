const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const filesToProcess = {
  sk: {
    terms: 'docs/vop_sk.docx',
    privacy: 'docs/gdpr_sk.docx',
    affiliate: 'docs/Affiliate_op_sk.docx'
  },
  cs: {
    terms: 'docs/vop_cz.docx',
    privacy: 'docs/gdpr_cz.docx',
    affiliate: 'docs/Affiliate_op_cz.docx'
  },
  en: {
    terms: 'docs/term_eng.docx',
    privacy: 'docs/gdpr_eng.docx',
    affiliate: 'docs/Affil_term_eng.docx'
  }
};

async function processDocs() {
  for (const [lang, files] of Object.entries(filesToProcess)) {
    const dictPath = path.join(__dirname, 'src', 'dictionaries', 'legal', `${lang}.json`);
    
    // Read the existing dictionary
    let dict;
    try {
      dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    } catch (e) {
      console.error(`Failed to read dictionary for ${lang}`, e);
      continue;
    }

    // Process each document type
    for (const [type, docPath] of Object.entries(files)) {
      const fullPath = path.join(__dirname, docPath);
      if (fs.existsSync(fullPath)) {
        try {
          const result = await mammoth.convertToHtml({ path: fullPath });
          let htmlContent = result.value;
          
          // Optional: Add some basic formatting cleanups if mammoth output is too bare
          // mammoth usually outputs <p>, <h1>, <h2>, <ul>, <ol>, <li>, <strong>, <em>
          // We can just rely on the Tailwind CSS typography we set up previously

          dict[type].content = htmlContent;
          console.log(`Successfully converted ${docPath} for ${lang} - ${type}`);
        } catch (error) {
          console.error(`Error converting ${docPath}:`, error);
        }
      } else {
        console.warn(`File not found: ${fullPath}`);
      }
    }

    // Save the updated dictionary back
    try {
      fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
      console.log(`Updated JSON for ${lang}`);
    } catch (e) {
      console.error(`Failed to write dictionary for ${lang}`, e);
    }
  }
}

processDocs().then(() => console.log('All done!')).catch(console.error);
