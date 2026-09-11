import { initDb } from "./index.ts";

await initDb();
console.log("Migration done");
process.exit(0);
