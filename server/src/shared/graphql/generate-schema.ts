import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { writeFile } from 'node:fs/promises';
import { ChaptersResolver } from '@chapters/chapters.resolver';
import { GenresResolver } from '@genres/genres.resolver';
import { MangasResolver } from '@mangas/mangas.resolver';
import { PagesResolver } from '@pages/pages.resolver';
import { UserResolver } from '@users/users.resolver';
import { GRAPHQL_SCHEMA_PATH } from '@shared/graphql/graphql.config';

async function generateGraphQLSchema(): Promise<void> {
  const app = await NestFactory.createApplicationContext(
    GraphQLSchemaBuilderModule,
    { logger: false },
  );

  try {
    const schemaFactory = app.get(GraphQLSchemaFactory);
    const schema = await schemaFactory.create([
      MangasResolver,
      ChaptersResolver,
      PagesResolver,
      UserResolver,
      GenresResolver,
    ]);

    const schemaDefinition = `${printSchema(
      lexicographicSortSchema(schema),
    )}\n`;

    await writeFile(GRAPHQL_SCHEMA_PATH, schemaDefinition, 'utf8');
  } finally {
    await app.close();
  }
}

void generateGraphQLSchema();
