import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Book } from 'src/book/book.entity';
import { BookType } from 'src/book/book.type';

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