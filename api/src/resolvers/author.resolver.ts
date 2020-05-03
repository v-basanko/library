import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthorType } from 'src/types';
import { AuthorInput } from "src/inputs";
import { AuthorService } from "src/services";
import { Author } from "src/entities";

@Resolver(of => AuthorType)
export class AuthorResolver {

  constructor(
    private authorService: AuthorService
  ) {}

  @Query(returns => AuthorType, {nullable: true})
  async getAuthor(
    @Args('id', {type: () => Int}) id:number
  ) {
    return await this.authorService.getAuthor(id);
  }

  @Query(returns => [AuthorType],{nullable: 'items'})
  async getAuthors(
    @Args('minNumberOfBooks',{nullable:true, type: () => Int}) minNumberOfBooks?: number, 
    @Args('maxNumberOfBooks',{nullable:true, type: () => Int}) maxNumberOfBooks?: number, 
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
    @Args('id', {type: () => Int}) id: number, 
  ):Promise<number> {
    return await this.authorService.deleteAuthor(id);
  }

  @Mutation(returns => Int)
  async deleteAuthorWithBooks(
    @Args('id', {type: () => Int}) id: number, 
  ):Promise<number> {
    return await this.authorService.deleteAuthorWithBooks(id);
  }

}