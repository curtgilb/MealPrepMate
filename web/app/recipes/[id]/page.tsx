import SingleColumnCentered from "@/components/layouts/single-column-centered";
import React from "react";
import { cacheExchange, createClient, fetchExchange, gql } from "@urql/core";
import { registerUrql } from "@urql/next/rsc";
import { graphql } from "@/gql";

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
      name
      marinadeTime
      leftoverFridgeLife
      isFavorite
      ingredients {
        sentence
      }
      ingredientFreshness
      id
      directions
      cuisine {
        name
      }
      course {
        name
      }
      cookTime
      category {
        name
      }
    }
  }
`);

const { getClient } = registerUrql(makeClient);

export default async function Recipe({ params }: { params: { id: string } }) {
  const result = await getClient().query(getRecipeQuery, {
    id: "cltus93fj000008jq4rh9fnod",
  });
  return (
    <SingleColumnCentered>
      <h1>{params.id}</h1>
      <h2>{JSON.stringify(result.data?.recipe)}</h2>
    </SingleColumnCentered>
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
