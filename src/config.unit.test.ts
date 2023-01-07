import Config from "./config";

describe("Config", () => {
    test("Root path returns a path ending in /cybermonkey", () => {
        const root = Config.getRootPath();
        // console.log(`Received value: ${root}`);
        expect(root.endsWith("\\cybermonkey")).toBe(true);
    });
    test("Root path does not contain src", () => {
        const root = Config.getRootPath();
        // console.log(`Received value: ${root}`);
        expect(root.includes("src")).toBe(false);
    });

    test("Default prefix is defined", () => {
        const defaultPrefix = Config.getDefaultPrefix();
        expect(defaultPrefix).toBeDefined();
        expect(typeof defaultPrefix).toBe("string");
    });
    test("Max prefix chars is defined", () => {
        const maxPrefixChars = Config.getMaxPrefixCharacters();
        expect(maxPrefixChars).toBeDefined();
        expect(typeof maxPrefixChars).toBe("number");
    });
});
