import { Repository, EntityRepository } from "typeorm";
import { Author, Book } from "src/entities";


@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {

    async getAuthor(id:number):Promise<Author | null> {
        return await this.createQueryBuilder('author')
            .leftJoinAndSelect('author.books', 'book')
            .getOne();
    }

    async getAuthorsByIds(ids:Array<number>):Promise<Author[]> {
        return await this.createQueryBuilder('author')
        .andWhere('author.id IN (:ids)',{ids})
        .getMany();
    }

    async getAuthors({minNumberOfBooks, maxNumberOfBooks}):Promise<Author[]> {
        const authors = await this.createQueryBuilder('author')
            .leftJoinAndSelect('author.books', 'book')
            .getMany();
        return authors
        .filter(author=>author.books.length >= minNumberOfBooks && author.books.length <= maxNumberOfBooks);
    }

    async deleteAuthorWithBooks(id:number):Promise<number> {
        const authorsCountByBook = await this.query(`
            SELECT 
                book_authors_author.bookId, 
                count(book_authors_author.authorId) AS authorsCount 
            FROM book_authors_author 
            WHERE book_authors_author.bookId IN (
                SELECT book_authors_author.bookId 
                FROM book_authors_author
                WHERE book_authors_author.authorId = ${id})
            GROUP BY book_authors_author.bookId`);
        const booksIdsWhithCurrentAuthorOnly = authorsCountByBook
            .filter(row=>row.authorsCount === 1)
            .map(row=>row.bookId)
       
        const promises = []
        promises.push(this.delete(id));
        if(booksIdsWhithCurrentAuthorOnly.length) 
            promises.push(this.createQueryBuilder()
                .delete()
                .from(Book)
                .where("id IN (:ids)",{ ids:booksIdsWhithCurrentAuthorOnly})
                .execute());
        const [ authorDeletingResult ] = await Promise.all(promises);
        return authorsCountByBook.length + authorDeletingResult.affected;
    }
}