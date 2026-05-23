const fs = require('fs');
const glob = require('glob');

const skeletonCode = 'return <SkeletonScreen />;';
const importStatement = 'import { SkeletonScreen } from "../../ui/SkeletonScreen";\n';
const importStatement3 = 'import { SkeletonScreen } from "../../../components/ui/SkeletonScreen";\n';

const spinnerRegex1 = /return\s*\(\s*<div className="flex-1 flex items-center justify-center bg-base">\s*<div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"><\/div>\s*<\/div>\s*\);/g;
const spinnerRegex2 = /return\s*\(\s*<div className="flex-1 flex items-center justify-center py-20">\s*<div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"><\/div>\s*<\/div>\s*\);/g;
const spinnerRegex3 = /return\s*\(\s*<div className="flex-1 flex items-center justify-center">\s*<div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"><\/div>\s*<\/div>\s*\);/g;

glob('c:/Users/Jay/Desktop/DorcasApp/src/components/screens/**/*.jsx', (err, files) => {
  if (err) throw err;
  let count = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    let isReplaced = false;
    
    if (spinnerRegex1.test(content) || spinnerRegex2.test(content) || spinnerRegex3.test(content)) {
      content = content.replace(spinnerRegex1, skeletonCode);
      content = content.replace(spinnerRegex2, skeletonCode);
      content = content.replace(spinnerRegex3, skeletonCode);
      isReplaced = true;
    }
    
    if (isReplaced && !content.includes('SkeletonScreen')) {
      // Find the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfImport = content.indexOf(';', lastImportIndex);
        if (endOfImport !== -1) {
          content = content.substring(0, endOfImport + 1) + '\n' + importStatement + content.substring(endOfImport + 1);
        } else {
           const endOfLine = content.indexOf('\n', lastImportIndex);
           content = content.substring(0, endOfLine + 1) + importStatement + content.substring(endOfLine + 1);
        }
      }
    }
    
    if (original !== content) {
      fs.writeFileSync(file, content);
      count++;
    }
  }
  console.log('Replaced in ' + count + ' files');
});
