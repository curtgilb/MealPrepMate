// import { builder } from "../builder.js";

// interface Results<T> {
//   nextCursor: number | null;
//   itemsRemaining: number;
//   items: T[];
// }

// function paginateResults<T>() {
//   builder.interfaceType(Results);
// }

// const ImportsQuery = builder
//   .objectRef<{
//     nextOffset: number | null;
//     itemsRemaining: number;
//     importJobs: Import[];
//   }>("ImportsQuery")
//   .implement({
//     fields: (t) => ({
//       nextOffset: t.exposeInt("nextOffset", { nullable: true }),
//       itemsRemaining: t.exposeInt("itemsRemaining"),
//       importJobs: t.field({
//         type: [ImportJob],
//         resolve: (result) => result.importJobs,
//       }),
//     }),
//   });
