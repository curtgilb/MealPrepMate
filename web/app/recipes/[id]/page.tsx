import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import { Button } from "@/components/ui/button";
import { getRecipeQuery } from "@/graphql/recipe/queries";
import { cacheExchange, createClient, fetchExchange } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getClient } from "@/ssrGraphqlClient";

export default async function Recipe({ params }: { params: { id: string } }) {
  const result = await getClient().query(getRecipeQuery, {
    id: params.id,
  });
  const recipe = result.data?.recipe;
  let primaryImage = recipe?.photos.find((photo) => {
    photo.isPrimary;
  });

  return (
    <div className="max-w-screen-2xl grid grid-cols-auto-fr gap-16">
      <div className="max-w-80">
        <Image
          src={primaryImage ? primaryImage.url : "/pot.jpg"}
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

        <Button variant="outline" asChild>
          <Link href={`/recipes/${params.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Recipe
          </Link>
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
