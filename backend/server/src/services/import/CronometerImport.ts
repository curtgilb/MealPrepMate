import { Import, ImportRecord } from "@prisma/client";
import { CsvOutput, readCSV } from "../io/Readers.js";
import { getFileMetaData } from "./ImportService.js";
import { hash } from "./ImportService.js";
import { db } from "../../db.js";
import { Match } from "./RecipeKeeperImport.js";
// Does hashing the buffer or string result in a different hash

export async function processCronometerImport(source: File): Promise<Import> {
  const fileMeta = getFileMetaData(source.name);
  const fileHash = hash(await source.text());
  // const bufferHash = hash(Buffer.from(await source.arrayBuffer()));

  // Take hash of file to compare to existing imports
  // If hash alreaddy exists, do not import
  const lastImport = await db.import.findFirst({
    where: { type: "CRONOMETER" },
    orderBy: { createdAt: "desc" },
  });

  if (lastImport?.fileHash === fileHash) {
    throw Error("No changes made since the last import");
  }

  const records = await readCSV(await source.text(), false);
  const matches = await findCronometerLabelMatches(records);
  for (const [index, record] of records.entries()) {
    if (matches[index].importStatus === "IMPORTED") {
    }
  }

  // If it doesn't match, compare each record raw input
  // Check for approxiamate matches with exact name matches
  // Create nutritional labels for ones that didn't match
  // Create import records
  return db.import.findUniqueOrThrow({ where: { id: "asdf" } });
}

async function findCronometerLabelMatches(data: CsvOutput[]): Promise<Match[]> {
  const matches: Match[] = [];
  const importRecords = await db.importRecord.findMany({
    where: { import: { type: "CRONOMETER" } },
    orderBy: { createdAt: "desc" },
    select: {
      rawInput: true,
      id: true,
      nutritionLabel: { select: { id: true, name: true } },
    },
  });
  const lookup = importRecords.reduce(
    (aggregation: Map<string, string>, record) => {
      if (!aggregation.has(record.rawInput) && record.nutritionLabel?.id) {
        aggregation.set(record.rawInput, record.nutritionLabel.id);
      }
      if (
        record.nutritionLabel?.name &&
        !aggregation.has(record.nutritionLabel.name)
      ) {
        aggregation.set(record.nutritionLabel.name, record.nutritionLabel.id);
      }
      return aggregation;
    },
    new Map()
  );

  for (const { record, raw } of data) {
    // Check for exact match
    if (lookup.has(raw)) {
      matches.push({
        matchingId: lookup.get(raw) as string,
        importStatus: "DUPLICATE",
      });
      continue;
    }

    // Check for approximate match
    if (lookup.has(record.name)) {
      matches.push({
        matchingId: lookup.get(record.name) as string,
        importStatus: "PENDING",
      });
      continue;
    }

    matches.push({ matchingId: undefined, importStatus: "IMPORTED" });
  }
  return matches;
}
