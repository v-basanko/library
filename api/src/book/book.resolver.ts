import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { BookType } from "./book.type";
import { BookService } from "./book.service";
import { BookInput } from "./book.input";
import { Book } from "./book.entity";
import { AuthorService } from "src/author/author.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";


@Resolver(of => BookType)
export class BookResolver {

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @Query(returns => BookType, {nullable: true})
  async getBook(
    @Args('id', {type: () => Int}) id:number
  ) {
    return await this.bookService.getBook(id);
  }

  @Query(returns => [BookType], {nullable: true})
  async getBooks(
    @Args('title',{nullable:true, defaultValue: null}) title:string
  ) {
    return await this.bookService.getBooks(title || '');
  }

  @Mutation(returns => BookType)
  async createBook(
  @Args('bookInput') bookInput: BookInput, 
  ):Promise<Book> {
    const { title, authorIds } = bookInput;
    const authors = await this.authorService.getAuthorsByIds(authorIds);
    if(!authors || !authors.length) throw new NotFoundException('Authors not found');
    const book = await this.bookService.createBook(title, authors);
    return book;
  }

  @Mutation(returns => BookType)
  async addAuthor(
  @Args('bookId', {type: () => Int}) bookId: number,
  @Args('authorId', {type: () => Int}) authorId: number 
  ):Promise<Book> {
    if(!bookId || !authorId) throw new BadRequestException('Book ID and AuthorId is required');
    const book = await this.bookService.getBook(bookId);
    if(!book) throw new NotFoundException(`Book ${bookId} not found`);
    const author = await this.authorService.getAuthor(authorId);
    if(!author) throw new NotFoundException(`Author ${authorId} not found`);
    if(book.authors.find(author=>author.id == authorId)) return book;
    book.authors.push(author);
    await book.save();
    return book;
  }

  @Mutation(returns => Int)
  async deleteBook(
    @Args('id', {type: () => Int}) id: number, 
  ):Promise<number> {
    return await this.bookService.deleteBook(id);
  }
}