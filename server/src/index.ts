import "dotenv/config";
import { createYoga, Plugin } from "graphql-yoga";
import { createServer } from "node:http";
import { createLogger, format, transports } from "winston";
import { schema } from "./graphql/Schema.js";

const PORT = 3025;
console.log(process.env);

const { combine, timestamp, colorize, align, json } = format;
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), align(), json()),
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

function useLogger(): Plugin {
  return {
    onExecute({ args }) {
      const startTime = performance.now();
      const queryName = args.contextValue.params.operationName || "Anonymous";
      const ipSource = "";
      const userId = "";
      args.document;

      return {
        onExecuteDone() {
          const endTime = performance.now();
          logger.info(queryName, {
            executionTime: endTime - startTime,
            queryName,
            ipSource,
            userId,
          });
        },
      };
    },
  };
}

const yoga = createYoga({ schema, plugins: [useLogger()] });

const server = createServer(yoga);
server.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
});
