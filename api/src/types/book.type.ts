import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Author } from 'src/entities';
import { AuthorType } from 'src/types';

@ObjectType('Book')
export class BookType {
  @Field(type => ID)
  id: number;

  @Field()
  title: string;

  @Field(() => [AuthorType], { defaultValue: [] })
  authors:Array<Author>

}