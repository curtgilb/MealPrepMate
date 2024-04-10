import SingleColumnCentered from "@/components/layouts/single-column-centered";
import React from "react";
import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";
import { graphql } from "@/gql";
import Image from "next/image";
import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

const makeClient = () => {
  return createClient({
    url: "http://localhost:3025/graphql",
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: { cache: "no-store" },
  });
};

const getRecipeQuery = graphql(/* GraphQL */ `
  query getRecipe($id: String!) {
    recipe(recipeId: $id) {
      prepTime
      source
      name
      marinadeTime
      leftoverFridgeLife
      isFavorite
      ingredients {
        ...RecipeIngredientFragment
      }
      photos {
        url
        id
        isPrimary
      }
      ingredientFreshness
      id
      directions
      cuisine {
        id
        name
      }
      course {
        id
        name
      }
      cookTime
      category {
        id
        name
      }
      notes
    }
  }
`);

const { getClient } = registerUrql(makeClient);

export default async function Recipe({ params }: { params: { id: string } }) {
  const result = await getClient().query(getRecipeQuery, {
    id: "cltus93fj000008jq4rh9fnod",
  });
  const recipe = result.data?.recipe;
  let primaryImage = recipe?.photos.find((photo) => {
    photo.isPrimary;
  });

  return (
    <div className="max-w-screen-2xl grid grid-cols-auto-fr gap-16">
      <div className="max-w-80">
        <Image
          src="http://localhost:9000/images/0bf7d411-0cab-4b67-b522-bb70785a706a.jpg"
          alt="recipe photo"
          style={{
            width: "100%",
            height: "auto",
          }}
          width={400}
          height={400}
        />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold">{recipe?.name}</h1>
        <p>
          {recipe?.cuisine.map((cuisine) => (
            <span key={cuisine.id}>{cuisine.name}</span>
          ))}

          {recipe?.course.map((course) => (
            <span key={course.id}>{course.name}</span>
          ))}

          {recipe?.category.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </p>
        {recipe?.source && recipe.source.startsWith("http") ? (
          <Link
            href={recipe.source}
            className="text-sm font-semibold hover:underline-offset-1 focus:underline-offset-4"
          >
            Source Website
          </Link>
        ) : (
          <p>recipe.source</p>
        )}
        <p>
          {recipe?.prepTime && <span>{recipe.prepTime} minutes prep </span>}
          {recipe?.marinadeTime && (
            <span>{recipe.marinadeTime} minutes marination </span>
          )}
          {recipe?.cookTime && <span>{recipe.cookTime} minutes cooking </span>}
        </p>

        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" /> Edit Recipe
        </Button>
      </div>
      <RecipeIngredients ingredients={recipe?.ingredients} />

      <div className="max-w-prose">
        <h2 className="text-xl font-bold">Directions</h2>
        <p>{recipe?.directions}</p>

        <h3 className="text-xl font-bold mt-8">Notes</h3>
        <p>{recipe?.notes}</p>
      </div>
    </div>
  );
}

// ("use client");
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Suspense } from "react";
// import { useMutation, gql } from "@urql/next";

// const UPLOAD_FILE = gql`
//   mutation importRecipeKeeper($file: File!) {
//     importCronometer(file: $file) {
//       id
//       records {
//         name
//         status
//       }
//       status
//     }
//   }
// `;

// export default function Home() {
//   const [selectedFile, setSelectedFile] = useState<File>();
//   const [result, uploadFile] = useMutation(UPLOAD_FILE);

//   const { data, fetching, error } = result;
//   const handleFileUpload = () => {
//     console.log(`${selectedFile}`);
//     uploadFile({ file: selectedFile });
//   };
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };
//   return (
//     <Suspense>
//       <main>
//         <Label htmlFor="picture">Picture</Label>
//         <Input onChange={handleFileChange} id="picture" type="file" />
//         <Button onClick={handleFileUpload}>Submit</Button>
//       </main>
//     </Suspense>
//   );
// }
