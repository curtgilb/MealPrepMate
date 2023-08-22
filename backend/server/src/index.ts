// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { PrismaClient } from "@prisma/client";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import path from "path";
import { dbClient } from "./db";

export interface MyContext {
  db: PrismaClient;
}

(async function main() {
  // Using express with graphql middleware in order to expose an HTTP endpoint for the Minio to notify the server of a new file upload.

  // A schema is a collection of type definitions (hence "typeDefs")
  // that together define the "shape" of queries that are executed against
  // your data.
  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, "./schema.graphql");
  const typeDefs = readFileSync(filePath, { encoding: "utf-8" });

  // Resolvers define how to fetch the types defined in your schema.
  // This resolver retrieves books from the "books" array above.
  const resolvers = {};

  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      // eslint-disable-next-line @typescript-eslint/require-await
      context: async ({ req, res }) => ({ db: dbClient }),
    })
  );

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post("/uploadHook", (req, res) => {
    console.log(req.body);
  });

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
})()
  .then(() => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  })
  .catch((error) => {
    console.error(error);
  });
