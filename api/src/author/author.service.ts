import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorRepository } from './author.repository';
import { AuthorInput } from './author.input';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author) private authorRepository: AuthorRepository
    ){}

    async getAuthor(id: number):Promise<Author | null> {
        return await this.authorRepository.getAuthor(id);
    }

    async getAuthorsByIds(ids:Array<number>):Promise<Author[]>{
        return await this.authorRepository.getAuthorsByIds(ids);
    }

    async createAuthor(authorInput: AuthorInput):Promise<Author>  {
        const { firstName, lastName } = authorInput;
        const author = new Author();
        author.firstName = firstName;
        author.lastName = lastName;
        await author.save();
        return author;
    }

    async getAuthors({minNumberOfBooks, maxNumberOfBooks}):Promise<Author[]> {
        return await this.authorRepository.getAuthors({minNumberOfBooks, maxNumberOfBooks});
    }

    async deleteAuthor(id:number):Promise<number> {
        const result = await this.authorRepository.delete(id);
        return result.affected 
    }

    async deleteAuthorWithBooks(id:number):Promise<number> {
        return await this.authorRepository.deleteAuthorWithBooks(id);
    }
}
