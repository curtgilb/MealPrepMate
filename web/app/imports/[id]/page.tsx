// import { graphql } from "@/gql";
// import { getClient } from "@/ssrGraphqlClient";
// import { DataTable } from "@/components/DataTable";
// import { ColumnDef } from "@tanstack/react-table";
// import { ImportRecord } from "@/gql/graphql";

// const itemsImportedQuery = graphql(/* GraphQL */ `
//   query MyQuery {
//     importRecords(
//       importId: "clv4vp1f800wrvybbijxixn5o"
//       pagination: { offset: 0, take: 117 }
//     ) {
//       records {
//         id
//         __typename
//         draft {
//           ... on Recipe {
//             __typename
//             id
//             name
//             photos {
//               isPrimary
//               url
//             }
//           }
//           ... on NutritionLabel {
//             __typename
//             id
//             labelName: name
//           }
//         }
//         recipe {
//           name
//           id
//         }
//         label {
//           id
//           name
//         }
//         ingredientGroup {
//           id
//           name
//         }
//         name
//         status
//         verifed
//       }
//     }
//   }
// `);

// type ColumnTypes = {
//   name: string;
//   status: string;
//   verifed: boolean;
// };

// const columns: ColumnDef<ColumnTypes>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "verifed",
//     header: "Verifed",
//   },
// ];

// export default async function ItemsImported() {
//   const result = await getClient().query(itemsImportedQuery, {});
//   const { data, error } = result;
//   if (error) return <p>Oh no... {error.message}</p>;

//   return (
//     <div>
//       <DataTable columns={columns} data={data?.importRecords.records ?? []} />
//     </div>
//   );
// }
