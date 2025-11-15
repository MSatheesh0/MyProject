
// Extend the Window interface to inform TypeScript about the global libraries
// This makes TypeScript aware of `window.mammoth`
declare global {
  interface Window {
    // mammoth is no longer needed here as we are using ES module import
  }
}

// Using aistudio CDN for PDF.js and esm.sh for Mammoth.js for reliability.
const PDF_JS_URL = 'https://aistudiocdn.com/pdfjs-dist@4.4.168/build/pdf.mjs';
const PDF_WORKER_URL = 'https://aistudiocdn.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
const MAMMOTH_JS_URL = 'https://esm.sh/mammoth@1.7.2';

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as ArrayBuffer.'));
            }
        };
        reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`));
        };
        reader.readAsArrayBuffer(file);
    });
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`));
        };
        reader.readAsText(file);
    });
};

const parsePdf = async (file: File): Promise<string> => {
    try {
        // Dynamically import the ES module version of pdf.js
        const pdfjsLib = await import(PDF_JS_URL);
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        return fullText;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error('Failed to parse PDF. The file may be unsupported or the parsing library could not load.');
    }
};

const parseDocx = async (file: File): Promise<string> => {
    try {
        // Dynamically import mammoth.js as an ES module
        const mammoth = await import(MAMMOTH_JS_URL);
        const arrayBuffer = await readFileAsArrayBuffer(file);
        // Use the default export which contains the library's functions
        const result = await mammoth.default.extractRawText({ arrayBuffer: arrayBuffer });
        return result.value;
    } catch (error) {
        console.error("DOCX Parsing Error:", error);
        throw new Error('Failed to parse DOCX. The file may be unsupported or the parsing library could not load.');
    }
};

export const parseFile = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    try {
        if (fileExtension === 'pdf') {
            return await parsePdf(file);
        }

        if (fileExtension === 'docx') {
            return await parseDocx(file);
        }

        if (['txt', 'md', 'js', 'ts', 'py', 'json', 'html', 'css'].includes(fileExtension || '')) {
            return await readFileAsText(file);
        }
    } catch (error) {
        console.error(`Error parsing ${file.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown parsing error occurred.';
        // Re-throw the error so it can be caught and handled in the UI component
        throw new Error(errorMessage);
    }
    
    throw new Error(`Unsupported file type: .${fileExtension}`);
};

