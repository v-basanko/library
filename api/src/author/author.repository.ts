import { Repository, EntityRepository } from "typeorm";
import { Author } from "./author.entity";
import { Book } from "src/book/book.entity";


@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {

    async getAuthor(id:number):Promise<Author | null> {
        const rows = await this.query(this.getSelectAuthorByIdSQL(id));
        if(!rows || !rows.length) return null;
        const author = new Author();
        author.id = rows[0].authorId;
        author.firstName = rows[0].authorFirstName;
        author.lastName = rows[0].authorLastName;
        author.books = rows
            .filter(row=>!!row.bookId)
            .map(row=>{
                const book = new Book();
                book.id = row.bookId;
                book.title = row.bookTitle;
                return book;
            });    
        return author;
    }

    async getAuthorsByIds(ids:Array<number>):Promise<Author[]> {
        const query = this.createQueryBuilder('author');
        query.andWhere('author.id IN (:ids)',{ids});
        const authors = await query.getMany();
        return authors;
    }

    async getAuthors({minNumberOfBooks, maxNumberOfBooks}):Promise<Author[]> {
        const rows = await this.query(this.getSelectAuthorsSQL());
        const authorMap = new Map<number, Author>();
        
        rows.forEach(row=>{
            if(!authorMap.has(row.authorId)) { 
                const newAuthor = new Author();
                newAuthor.id = row.authorId;
                newAuthor.firstName = row.authorFirstName;
                newAuthor.lastName = row.authorLastName;
                newAuthor.books = []
                authorMap.set(row.authorId, newAuthor);
            }
            const author = authorMap.get(row.authorId);
            if(!row.bookId) return;
            const book = new Book();
            book.id = row.bookId;
            book.title = row.bookTitle;
            author.books.push(book);
        });
        const authors:Array<Author> = [];

        for(const author of authorMap.values()) authors.push(author);

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

    private getSelectAuthorsSQL():string {
        return `
        SELECT 
            author.id AS authorId,
            author.firstName AS authorFirstName,
            author.lastName AS authorLastName,
            book.id AS bookId,
            book.title AS bookTitle
        FROM author 
        LEFT OUTER JOIN book_authors_author ON author.id = book_authors_author.authorId
        LEFT JOIN book ON book.id = book_authors_author.bookId`
    }

    private getSelectAuthorByIdSQL(id:number):string {
        return `${this.getSelectAuthorsSQL()} WHERE author.id = ${id}`;
    }
}