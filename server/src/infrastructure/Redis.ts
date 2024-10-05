export const connection = {
  connection: {
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : (6379 as number),
  },
};
