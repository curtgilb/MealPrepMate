import {
  Import,
  ImportRecord,
  ImportStatus,
  ImportType,
  Prisma,
} from "@prisma/client";
import { DbTransactionClient, db } from "../../db.js";
import { Match, RecordWithImport } from "../../types/CustomTypes.js";

type ImportServiceInput = {
  source: string | File;
  import: Import;
};

type UpdateImportInput = {
  fileName?: string;
  fileHash?: string;
  status?: ImportStatus;
  imageMapping?: Prisma.JsonObject;
  recordIds?: string[];
};

class MatchManager {
  match: Match;
  constructor(match: Match) {
    this.match = match;
  }

  setMatch(match: Match) {
    this.match = {
      ...this.match,
      ...match,
    };
  }

  getMatch() {
    return this.match;
  }
}

abstract class ImportService {
  input: ImportServiceInput;

  constructor(input: ImportServiceInput | Import) {
    if (Object.hasOwn(input, "id"))
      this.input = { source: "", import: input as Import };
    else {
      this.input = input as ImportServiceInput;
    }
  }

  abstract recreateRecord(record: ImportRecord): Promise<string>;

  abstract processImport(): Promise<void>;

  getImageMapping() {
    return this.input.import.imageMapping
      ? new Map<string, string>(Object.entries(this.input.import.imageMapping))
      : undefined;
  }

  protected async getLastImport(): Promise<Import | null> {
    return await db.import.findFirst({
      where: {
        type: this.input.import.type,
        id: { not: this.input.import.id },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  protected async updateImport(
    update: UpdateImportInput,
    tx?: DbTransactionClient
  ) {
    const dbClient = tx ? tx : db;
    const updatedImport = await dbClient.import.update({
      where: {
        id: this.input.import.id,
      },
      data: {
        fileName: update.fileName,
        fileHash: update.fileHash,
        status: update.status,
        imageMapping: update.imageMapping,
        importRecords: {
          set: update.recordIds?.map((id) => ({
            id,
          })),
        },
      },
    });
    this.input.import = updatedImport;
  }
}

export { ImportService, ImportServiceInput, MatchManager };
