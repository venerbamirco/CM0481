import { Environment } from '../environment';

const fs = require('fs');
const path = require('path');

export function saveSourceCode(id: string, sourceCode: Buffer) : string {
    const sourceBuildPath = path.join(Environment.buildPath, id);
    const sourceFileBuildPath = path.join(sourceBuildPath, Environment.sourceFileName);

    if (fs.existsSync(sourceBuildPath)){
        throw new Error(`sourceBuildPath ${sourceBuildPath} already exists`);
    }

    // create sub-directory
    fs.mkdirSync(sourceBuildPath);
    // save source code content to file
    fs.writeFileSync(sourceFileBuildPath, sourceCode);

    return sourceBuildPath;
}

export function cleanData(folderPath?: string) {
    if (folderPath) {
        fs.rm(folderPath, { recursive: true }, () => {});
    }
}