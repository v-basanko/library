import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Author } from 'src/author/author.entity';
import { AuthorType } from 'src/author/author.type';

@ObjectType('Book')
export class BookType {
  @Field(type => ID)
  id: number;

  @Field()
  title: string;

  @Field(() => [AuthorType], { defaultValue: [] })
  authors:Array<Author>

}