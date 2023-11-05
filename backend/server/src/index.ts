import { schema } from "./graphql/Schema.js";
import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";

const PORT = 3025

const yoga = createYoga({schema});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(yoga);
server.listen(PORT, () => { console.log(`Server listening on ${PORT}`)});
