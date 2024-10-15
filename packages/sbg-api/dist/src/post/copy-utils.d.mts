export declare function processFile(filePath: string, onComplete: (content: string) => void | Promise<void>, onError: (err: Error) => void | Promise<void>): void;
export declare function processFiles(filePaths: string[], onComplete: (filePath: string, content: string) => void | Promise<void>, onError: (filePath: string, err: Error) => void | Promise<void>): Promise<void>;
