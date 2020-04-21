import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql";
import { AuthorType } from './author.type';
import { AuthorInput } from "./author.input";
import { AuthorService } from "./author.service";
import { Author } from "./author.entity";
import { ParseIntPipe } from "@nestjs/common";

@Resolver(of => AuthorType)
export class AuthorResolver {

  constructor(
    private authorService: AuthorService
  ) {}

  @Query(returns => AuthorType, {nullable: true})
  async getAuthor(
    @Args('id') id:number
  ) {
    return await this.authorService.getAuthor(id);
  }

  @Query(returns => [AuthorType],{nullable: 'items'})
  async getAuthors(
    @Args('minNumberOfBooks',{nullable:true, defaultValue: null}) minNumberOfBooks?: number, 
    @Args('maxNumberOfBooks',{nullable:true, defaultValue: null}) maxNumberOfBooks?: number, 
  ) {
    return await this.authorService.getAuthors({
      minNumberOfBooks: minNumberOfBooks || 0, 
      maxNumberOfBooks: maxNumberOfBooks || Infinity
    });
  }

  @Mutation(returns => AuthorType)
  async createAuthor(
    @Args('authorInput') authorInput: AuthorInput, 
  ):Promise<Author> {
    return await this.authorService.createAuthor(authorInput);
  }

  @Mutation(returns => Int)
  async deleteAuthor(
    @Args('id') id: number, 
  ):Promise<number> {
    return await this.authorService.deleteAuthor(id);
  }

  @Mutation(returns => Int)
  async deleteAuthorWithBooks(
    @Args('id') id: number, 
  ):Promise<number> {
    return await this.authorService.deleteAuthorWithBooks(id);
  }

}