import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { AuthorService } from 'src/author/author.service';
import { AuthorRepository } from 'src/author/author.repository';

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
