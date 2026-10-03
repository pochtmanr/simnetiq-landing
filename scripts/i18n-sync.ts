/* Regenerates content/locales/index.generated.ts, the static import table the
 * loaders read. Run after adding or removing any locale JSON file. */
import { writeFileSync } from "node:fs";
import { BARREL, renderBarrel } from "./i18n-files";

writeFileSync(BARREL, renderBarrel());
console.log("i18n:sync wrote content/locales/index.generated.ts");
