import { Module } from '@nestjs/common';
import { BookService, AuthorService } from 'src/services';
import { BookResolver } from 'src/resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository, AuthorRepository } from 'src/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([
    AuthorRepository,
    BookRepository])],
  providers: [
    BookResolver,
    BookService,
    AuthorService,
  ]
})
export class BookModule {}
