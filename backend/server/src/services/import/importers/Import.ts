import {
  Import as PrismaImport,
  ImportRecord,
  Prisma,
  RecordStatus,
} from "@prisma/client";
import { DbTransactionClient, db } from "../../../db.js";
import { Match, MatchArgs } from "../../../types/CustomTypes.js";

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

abstract class Importer {
  input: ImportServiceInput;

  // Import service input just has an extra  field for source (like a file path), this allows for local file import
  // Import record is already made by message queue, this class is instantiated to process that import
  constructor(input: ImportServiceInput | PrismaImport) {
    if (Object.hasOwn(input, "id"))
      this.input = { source: "", import: input as PrismaImport };
    else {
      this.input = input as ImportServiceInput;
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
    record: ImportRecord,
    newStatus: RecordStatus
  ): Promise<void>;

  abstract finalize(record: ImportRecord): Promise<void>;

  abstract deleteDraft(
    recordId: string,
    draftId: string | null,
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
