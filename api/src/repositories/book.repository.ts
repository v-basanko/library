import { Repository, EntityRepository } from "typeorm";
import { Book } from "src/entities";


@EntityRepository(Book)
export class BookRepository extends Repository<Book> {

    async getBooks(title:string):Promise<Book[]> {
        if(!title.includes('%')) title = `%${title}%`;
        const books = await this.createQueryBuilder('book')
        .where('LOWER(book.title) LIKE LOWER(:title)', { title })
        .leftJoinAndSelect('book.authors', 'author')
        .getMany();
        return books;
    }
}