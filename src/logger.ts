import { existsSync, mkdirSync } from "fs";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";

const ENVIRONMENT: string = process.env.ENVIRONMENT || "PROD";

const logLevels = {
    error: 0,
    warn: 1,
    debug: 2,
};
const logFolderPath = "logs";

if (!existsSync(logFolderPath)) mkdirSync(logFolderPath);

const fileTransport = new transports.DailyRotateFile({
    filename: path.join(logFolderPath, "musicPlayerError-%DATE%.log"),
    level: "warn",
    datePattern: "DD-MM-YYYY",
    maxFiles: "3d",
});

const consoleTransport = new transports.Console({
    level: "debug",
    format: format.combine(format.colorize(), format.prettyPrint(), format.simple()),
});

let transportArr;

if (ENVIRONMENT == "PROD") {
    transportArr = [fileTransport, consoleTransport];
} else {
    transportArr = [consoleTransport];
}

export const logger = createLogger({
    levels: logLevels,
    format: format.combine(format.colorize(), format.splat(), format.timestamp(), format.json()),
    transports: transportArr,
});

export default logger;
