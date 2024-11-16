import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("../package.json", "utf-8"));

export const VERSION = pkg.version;
