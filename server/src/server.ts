import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import chalk from "chalk";
import { connectToDb } from "@config//database.js";
import mangaRouter from "@rest/manga.routes.js";
import uploadsRouter from "@rest/access.routes.js";
import cors from "cors";
import genresRouter from "@rest/genres.routes.js";
import { buildSchema } from "type-graphql";
import { MangaResolver } from "@resolvers/manga.resolvers.js";
import { ChapterResolver } from "@resolvers/chapter.resolvers.js";
import { PageResolver } from "@resolvers/page.resolvers.js";
import chapterRouter from "@rest/chapter.routes.js";
import authRouter from "@rest/auth.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "@middlewares/error.middleware.js";
import { ENV } from "@validators/env.validators.js";
import userRouter from "@rest/user.routes.js";
import { UserResolver } from "@resolvers/user.resolver.js";

async function main() {
  await connectToDb(); // connect to MongoDB before starting the server to ensure DB is available for resolvers

  const schema = await buildSchema({
    resolvers: [MangaResolver, ChapterResolver, PageResolver, UserResolver],
  });
  const server = new ApolloServer({
    schema,
  });

  await server.start(); // start graphql Apollo server

  const app = express(); // start rest express server

  app.use(
    cors({
      origin: ENV.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }),
  );
  app.use(express.json()); // required for parsing application/json
  app.use(cookieParser());

  app.get("/healthz", (_req, res) => {
    res
      .status(200)
      .json({ status: "ok", uptime: process.uptime().toFixed(3) + " s" });
  });

  app.use("/graphql", expressMiddleware(server));

  // Rest routes
  app.use("/manga", mangaRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/genres", genresRouter);
  app.use("/api/chapter", chapterRouter);
  app.use("/api/auth", authRouter);
  app.use("/user", userRouter);

  // ? Custom error handler
  app.use(errorHandler);

  app.listen(ENV.PORT, "0.0.0.0", () => {
    console.log(
      chalk.green("[Server running]:"),
      chalk.blue(`http://localhost:${ENV.PORT}/`),
    );
  });
}

main().catch((error) => {
  console.error(chalk.red("[Error starting server]:"), error);
  process.exit(1);
});
