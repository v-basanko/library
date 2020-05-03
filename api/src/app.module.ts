import { Module } from '@nestjs/common';
import { AuthorModule, BookModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { typeOrmConfig } from './config/typeorm.config';


@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthorModule, 
    BookModule
  ],
  controllers: [],
})
export class AppModule {}
