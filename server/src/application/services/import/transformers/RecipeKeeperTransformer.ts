import {
  FileSource,
  Transformer,
} from "@/application/services/import/transformers/Transformer.js";
import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";

class RecipeKeeperTransformer implements Transformer<CreateRecipeInput> {
  transform(input: string | FileSource): CreateRecipeInput[] {
    return [];
  }
}
