import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Book } from 'src/entities';
import { BookType } from 'src/types';

@ObjectType('Author')
export class AuthorType {
  @Field(type => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => [BookType], { defaultValue: [] })
  books:Array<Book>
}