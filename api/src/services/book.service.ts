import { Injectable } from '@nestjs/common';
import { Book, Author } from 'src/entities';
import { BookRepository } from 'src/repositories';

@Injectable()
export class BookService {

    constructor(
        private bookRepository:BookRepository
    ){}

    async getBook(id: number):Promise<Book | null> {
        return await this.bookRepository.findOne(id);
    }

    async getBooks(title:string):Promise<Book[]> {
        return await this.bookRepository.getBooks(title);
    }

    async createBook(title: string, authors:Array<Author>):Promise<Book>  {
        const book = new Book();
        book.title = title;
        book.authors = authors;
        await book.save();
        return book;
    }

    async deleteBook(id:number):Promise<number> {
        const result = await this.bookRepository.delete(id);
        return result.affected 
    }
}
