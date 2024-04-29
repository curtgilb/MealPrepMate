import { schema } from "./graphql/Schema.js";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
// import { applyMiddleware } from "graphql-middleware";

const PORT = 3025;

// const middlewareSchema = applyMiddleware(
//   schema,
//   async (
//     resolve,
//     root,
//     args,
//     context: {

//       params: { query: string };
//       req: { socket: { remoteAddress: string } };
//     },
//     info: { fieldName: string }
//   ) => {
//     if (!root) {
//       console.log(`SOURCE IP ADDRESS: ${context.req.socket.remoteAddress} `);
//       info.fieldName, context.params.query, context.req.socket.remoteAddress;
//     }
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     return await resolve(root, args, context, info);
//   }
// );

const yoga = createYoga({ schema });

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(yoga);
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
