// import { Import } from "@/gql/graphql";
// import { DataTable } from "@/components/DataTable";
// import { getClient } from "@/ssrGraphqlClient";
// import { graphql } from "@/gql";
// import { ColumnDef } from "@tanstack/react-table";
// import ImportFileUpload from "@/components/imports/ImportFileUpload";

// const importsQuery = graphql(/* GraphQL */ `
//   query getImports {
//     imports(pagination: { offset: 0, take: 10 }) {
//       importJobs {
//         createdAt
//         fileName
//         id
//         recordsCount
//         status
//         type
//       }
//     }
//   }
// `);

// export const columns: ColumnDef<Import>[] = [
//   {
//     accessorKey: "type",
//     header: "Type",
//   },
//   {
//     accessorKey: "fileName",
//     header: "File",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Date",
//   },
//   {
//     accessorKey: "recordsCount",
//     header: "Items Imported",
//   },
//   // {
//   //   id: "actions",
//   //   header: "Actions",
//   //   cell: ({ row }) => {
//   //     const original = row.original;
//   //     return (
//   //       <DropdownMenu>
//   //         <DropdownMenuTrigger asChild>
//   //           <Button variant="ghost" className="h-8 w-8 p-0">
//   //             {/* <span className="sr-only">Open menu</span> */}
//   //             <MoreHorizontal className="h-4 w-4" />
//   //           </Button>
//   //         </DropdownMenuTrigger>
//   //         <DropdownMenuContent align="end">
//   //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//   //           <DropdownMenuSeparator />
//   //           <DropdownMenuItem>View customer</DropdownMenuItem>
//   //           <DropdownMenuItem>View payment details</DropdownMenuItem>
//   //         </DropdownMenuContent>
//   //       </DropdownMenu>
//   //     );
//   //   },
//   // },
// ];

// export default async function ImportsPage() {
//   const result = await getClient().query(importsQuery, {});
//   const { data, error } = result;
//   if (error) return <p>Oh no... {error.message}</p>;

//   return (
//     <div>
//       <div className="mb-8 flex">
//         <ImportFileUpload />
//         {/* <Button variant="secondary">
//           <Plus className="mr-2 h-4 w-4" /> Import file
//         </Button> */}
//       </div>
//       <DataTable columns={columns} data={data?.imports.importJobs ?? []} />
//     </div>
//   );
// }
