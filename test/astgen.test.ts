import * as path from "node:path"
import * as os from "node:os"
import * as fs from "node:fs"
import start from "../src/index"

describe('astgen basic functionality', () => {
    it('should parse simple js file correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "main.js");
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");

        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: true,
            "exclude-file": []
        });
        const resultAst = fs.readFileSync(path.join(tmpDir, "ast_out", "main.js.json")).toString();
        expect(resultAst).toContain("\"fullName\":\"" + testFile.replaceAll("\\", "\\\\") + "\"");
        expect(resultAst).toContain("\"relativeName\":\"main.js\"");
        const resultTypes = fs.readFileSync(path.join(tmpDir, "ast_out", "main.js.typemap")).toString();
        expect(resultTypes).toEqual("{\"0\":\"Console\",\"8\":\"{ (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; }\",\"12\":\"\\\"Hello, world!\\\"\"}");

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by relative file path correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "main.js");
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": ["main.js"]
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by absolute file path correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "main.js");
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": [testFile]
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by relative file path with dir correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "src", "main.js");
        fs.mkdirSync(path.join(tmpDir, "src"))
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": [path.join("src", "main.js")]
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "src", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by relative dir path correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "src", "main.js");
        fs.mkdirSync(path.join(tmpDir, "src"))
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": ["src"]
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "src", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by absolute dir path correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "src", "main.js");
        fs.mkdirSync(path.join(tmpDir, "src"))
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": [path.join(tmpDir, "src")]
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

    it('should exclude files by regex correctly', async () => {
        const tmpDir: string = fs.mkdtempSync(path.join(os.tmpdir(), "astgen-tests"));
        const testFile = path.join(tmpDir, "main.js");
        fs.writeFileSync(testFile, "console.log(\"Hello, world!\");");
        await start({
            src: tmpDir,
            type: "js",
            output: path.join(tmpDir, "ast_out"),
            recurse: true,
            tsTypes: false,
            "exclude-file": [],
            "exclude-regex": new RegExp(".*main.*", "i")
        });
        expect(fs.existsSync(path.join(tmpDir, "ast_out", "main.js.json"))).toBeFalsy()

        fs.rmSync(tmpDir, {recursive: true});
    });

});