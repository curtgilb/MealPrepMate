import {
  Import as PrismaImport,
  ImportItem,
  Prisma,
  RecordStatus,
} from "@prisma/client";
import { DbTransactionClient, db } from "../../../infrastructure/db.js";
import { Match, MatchArgs } from "../../../types/CustomTypes.js";

type ImportServiceInput = {
  source: string | File;
  import: PrismaImport;
};

type MatchUpdate = {
  record: ImportItem;
  matchingRecipeId?: string;
  matchingLabelId?: string;
  createDraft: boolean;
  tx?: DbTransactionClient;
};

abstract class Importer {
  input: ImportServiceInput;

  // Import service input just has an extra  field for source (like a file path), this allows for local file import
  // Import record is already made by message queue, this class is instantiated to process that import
  constructor(input: ImportServiceInput | PrismaImport) {
    if ("id" in input) this.input = { source: "", import: input };
    else {
      this.input = input;
    }
  }

  async isDuplicateImport(newHash: string | undefined) {
    const lastImport = await this.getLastImport();
    // Check to see if this is a duplicate upload
    if (lastImport?.fileHash === newHash) {
      await this.updateImport({
        fileHash: newHash,
        status: "DUPLICATE",
      });
      return true;
    }
    return false;
  }

  abstract createDraft(
    record: ImportItem,
    newStatus: RecordStatus
  ): Promise<void>;

  abstract finalize(record: ImportItem): Promise<void>;

  abstract deleteDraft(
    importRecord: ImportItem,
    newStatus: RecordStatus
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
    update: Prisma.ImportUpdateInput,
    tx?: DbTransactionClient
  ) {
    const dbClient = tx ? tx : db;
    const updatedImport = await dbClient.import.update({
      where: {
        id: this.input.import.id,
      },
      data: update,
    });
    this.input.import = updatedImport;
  }
}

class MatchManager {
  match: Match;
  constructor(match: Match) {
    this.match = match;
  }

  setMatch(match: MatchArgs) {
    this.match = {
      ...this.match,
      ...match,
    };
  }
  getMatch(): Match {
    return this.match;
  }
}

export { Importer, ImportServiceInput, MatchManager, MatchUpdate };
