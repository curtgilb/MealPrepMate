// import { ScrollArea } from "@/components/ui/scroll-area";
// import { graphql } from "@/gql";
// import { useQuery } from "@urql/next";
// import pluralize from "pluralize";
// import useMeasure from "react-use-measure";
// import { IngredientCategoryFilter } from "./IngredientCategoryFilter";

// const getCombinedIngredients = graphql(`
//   query GetCombinedIngredients($mealPlanId: String!) {
//     mealPlanIngredients(mealPlanId: $mealPlanId) {
//       total {
//         qty
//         unit {
//           id
//           name
//           symbol
//         }
//       }
//       recipeIngredients {
//         name
//         factor
//         recipeIngredient {
//           id
//           name
//           quantity
//           sentence
//           unit {
//             id
//             name
//             symbol
//           }
//         }
//       }
//       baseIngredient {
//         id
//         name
//       }
//     }
//   }
// `);

// interface AllIngredientsProps {
//   mealPlanId: string;
// }

// export function AllIngredients({ mealPlanId }: AllIngredientsProps) {
//   const [ref, bounds] = useMeasure();
//   const [result] = useQuery({
//     query: getCombinedIngredients,
//     variables: { mealPlanId },
//   });
//   const { data, error, fetching } = result;
//   bounds.height;

//   return (
//     <div className="flex flex-col gap-y-8 h-full">
//       <IngredientCategoryFilter />
//       <div ref={ref} className="h-full w-full">
//         <ScrollArea style={{ height: bounds.height }}>
//           <div className="flex flex-col gap-y-4">
//             {data?.mealPlanIngredients.map((ingredientGroup) => {
//               const total =
//                 ingredientGroup.total.length === 1
//                   ? `(${ingredientGroup.total[0].qty} ${ingredientGroup.total[0].unit?.symbol})`
//                   : "";
//               return (
//                 <div key={ingredientGroup.baseIngredient?.id}>
//                   <p className="font-semibold">
//                     {`${
//                       ingredientGroup.baseIngredient?.name ?? "Other"
//                     } ${total}`}
//                   </p>
//                   <ul className="list-disc pl-6 flex flex-col gap-y-1">
//                     {ingredientGroup.recipeIngredients.map((ingredient) => {
//                       const recipIngredientTotal =
//                         (ingredient.recipeIngredient.quantity ?? 1) *
//                         ingredient.factor;
//                       let unitName =
//                         !ingredient.recipeIngredient.unit?.name ||
//                         ingredient.recipeIngredient.unit?.name === "unit"
//                           ? ingredientGroup.baseIngredient?.name.toLowerCase()
//                           : ingredient.recipeIngredient.unit.name;

//                       if (!unitName) {
//                         unitName = ingredient.recipeIngredient.name
//                           ? ingredient.recipeIngredient.name
//                           : "";
//                       }

//                       return (
//                         <li key={ingredient.recipeIngredient.id}>
//                           <p>{`${recipIngredientTotal} ${pluralize(
//                             unitName,
//                             recipIngredientTotal
//                           )}`}</p>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               );
//             })}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }
