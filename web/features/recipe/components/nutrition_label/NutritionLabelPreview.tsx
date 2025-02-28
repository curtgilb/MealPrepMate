import { RecipeNutritionlabel } from "@/features/recipe/components/nutrition_label/RecipeNutritionLabel";
import { NutritionFormValues } from "@/features/recipe/hooks/useNutritionLabelForm";
import { NutritionLabelFieldsFragment } from "@/gql/graphql";

interface NutritionLabelPreviewProps {
  activeLabel: NutritionFormValues;
  otherLabels: NutritionLabelFieldsFragment[];
}

export function NutritionLabelPreview({
  activeLabel,
  otherLabels,
}: NutritionLabelPreviewProps) {
  const otherLabelPrimary = otherLabels.find((label) => label.isPrimary);
  const servings = otherLabelPrimary
    ? otherLabelPrimary.servings
    : Number(activeLabel.servings);

  const nutrientValues = [activeLabel, ...otherLabels].reduce(
    (total, label) => {
      const isForm = !("id" in label);
      const servings = label.servings ?? 1;
      const servingsUsed = label.servingsUsed || servings;

      label.nutrients.forEach((nutrient) => {
        const id = isForm
          ? (nutrient as NutritionFormValues["nutrients"][number]).nutrientId
          : (nutrient as NutritionLabelFieldsFragment["nutrients"][number])
              .nutrient.id;
        const value = Number(nutrient.value) * (servingsUsed / servings);

        if (!(id in total)) {
          total[id] = 0;
        }

        total[id] = total[id] + value;
      });

      return total;
    },
    {} as { [key: string]: number }
  );

  return (
    <div className=" sticky top-0">
      <p className="text-lg font-serif font-bold mb-6">
        Combined Nutrition Label Preview
      </p>
      <RecipeNutritionlabel
        label={{
          servings: servings ?? 1,
          nutrients: nutrientValues,
        }}
      />
    </div>
  );
}
