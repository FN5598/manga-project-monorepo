import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import chalk from "chalk";
import { typeDefs } from "@graphql/typedefs.js";
import { resolvers } from "@resolvers/resolvers.js";
import { connectToDb } from "@config//database.js";
import dotenv from "dotenv";
import mangaRouter from "@rest/manga.routes.js";
import uploadsRouter from "@rest/access.routes.js";
import cors from "cors";
import genresRouter from "@rest/genres.routes.js";

dotenv.config(); // Load environment variables from .env file

async function main() {
  await connectToDb(); // connect to MongoDB before starting the server to ensure DB is available for resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // start graphql Apollo server

  const app = express(); // start rest express server

  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  );
  app.use(express.json()); // required for parsing application/json
  app.use("/graphql", expressMiddleware(server));

  // Rest routes
  app.use("/manga", mangaRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/genres", genresRouter);

  app.listen(4000, () => {
    console.log(
      chalk.green("[Server running]:"),
      chalk.blue("http://localhost:4000/"),
    );
  });
}

main().catch((error) => {
  console.error(chalk.red("[Error starting server]:"), error);
  process.exit(1);
});
