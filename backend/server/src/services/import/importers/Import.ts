import {
  Import as PrismaImport,
  ImportRecord,
  ImportStatus,
  Prisma,
} from "@prisma/client";
import { DbTransactionClient, db } from "../../../db.js";
import { Match } from "../../../types/CustomTypes.js";

type ImportServiceInput = {
  source: string | File;
  import: PrismaImport;
};

type MatchUpdate = {
  record: ImportRecord;
  matchingRecipeId?: string;
  matchingLabelId?: string;
  createDraft: boolean;
  tx?: DbTransactionClient;
};

type UpdateImportInput = {
  fileName?: string;
  fileHash?: string;
  status?: ImportStatus;
  imageMapping?: Prisma.JsonObject;
  recordIds?: string[];
};

abstract class Importer {
  input: ImportServiceInput;

  constructor(input: ImportServiceInput | PrismaImport) {
    if (Object.hasOwn(input, "id"))
      this.input = { source: "", import: input as PrismaImport };
    else {
      this.input = input as ImportServiceInput;
    }
  }

  abstract updateMatch(update: MatchUpdate): Promise<ImportRecord>;

  abstract createDraft(
    record: ImportRecord,
    tx?: DbTransactionClient
  ): Promise<string>;

  abstract finalize(record: ImportRecord): Promise<void>;

  abstract deleteDraft(
    draftId: string | null,
    tx?: DbTransactionClient
  ): Promise<void>;

  abstract processImport(): Promise<void>;

  getImageMapping() {
    return this.input.import.imageMapping
      ? new Map<string, string>(Object.entries(this.input.import.imageMapping))
      : undefined;
  }

  protected async getLastImport(): Promise<PrismaImport | null> {
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

export { Importer, ImportServiceInput, MatchManager, MatchUpdate };
