import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsString, IsArray, ArrayMinSize } from 'class-validator';

@InputType()
export class BookInput {
 
  @IsString()
  @MinLength(1)
  @Field()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @Field(() => [ID], { defaultValue: [] })
  authorIds: number[];
  
}