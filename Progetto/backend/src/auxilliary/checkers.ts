// check if the source code is base64 encoded correctly
//export let correctBase64 = (sourceCode: String) => Buffer.from(sourceCode, 'base64').toString('base64') !== sourceCode;

export function correctBase64(sourceCode: String){
    let decoded = Buffer.from(sourceCode, 'base64').toString('binary');
    let encoded = Buffer.from(decoded).toString('base64');
    return (sourceCode == encoded);
}