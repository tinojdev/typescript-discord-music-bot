import { readFileSync } from "fs";
import path from "path";

export interface ConfigInterface {
    default_prefix: string;
    max_prefix_chars: number;
}

const configPath = path.join(__dirname, "../config.json");
const configObject = <ConfigInterface>JSON.parse(readFileSync(configPath, "utf-8"));

namespace Config {
    export const getRootPath = (): string => {
        return path.resolve(__dirname, "..");
    };
    export const getDefaultPrefix = () => {
        return configObject.default_prefix;
    };
    export const getMaxPrefixCharacters = () => {
        return configObject.max_prefix_chars;
    };
}

export default Config;
