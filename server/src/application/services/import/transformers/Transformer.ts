import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";
import { CentralDirectory, Open, File as ZipFile } from "unzipper";
import { CreateNutritionLabelInput } from "@/types/gql.js";
import { downloadFile } from "@/infrastructure/bucket/storage.js";

export type FileSource =
  | { type: "local"; filePath: string }
  | { type: "remote"; bucketPath: string }
  | { type: "upload"; file: File };

type TransformedTypes = CreateRecipeInput | CreateNutritionLabelInput;

export abstract class Transformer<T extends TransformedTypes> {
  abstract transform(source: FileSource): T[];

  // Retrieves the contents from
  protected readFile(source: FileSource) {
    switch (source.type) {
      case "local":
        return await Open.file(source.filePath);
      case "remote":
        const file = await downloadFile(source.bucketPath);
        return await Open.buffer(Buffer.from(await file.arrayBuffer()));
      case "upload":
        return await Open.buffer(Buffer.from(await source.file.arrayBuffer()));
      default:
        throw Error(`Invalid object passed to unzipFile`);
    }
  }

  protected async unzipFile(source: FileSource): Promise<CentralDirectory> {
    switch (source.type) {
      case "local":
        return await Open.file(source.filePath);
      case "remote":
        const file = await downloadFile(source.bucketPath);
        return await Open.buffer(Buffer.from(await file.arrayBuffer()));
      case "upload":
        return await Open.buffer(Buffer.from(await source.file.arrayBuffer()));
      default:
        throw Error(`Invalid object passed to unzipFile`);
    }
  }
}
