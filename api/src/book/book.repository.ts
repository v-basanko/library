import { Repository, EntityRepository } from "typeorm";
import { Book } from "./book.entity";
import { Author } from "src/author/author.entity";


@EntityRepository(Book)
export class BookRepository extends Repository<Book> {

    async getBook(id:number):Promise<Book | null> {
        const rows = await this.query(this.getSelectBookByIdSQL(id));
        if(!rows || !rows.length) return null;
        const book = new Book();
        const authors = [];

        rows.forEach((row, index)=>{
            if(index > 0) return;
            book.id = row.bookId;
            book.title = row.title;

            if(!row.authorId) return;
            const author = new Author();
            author.id = row.authorId;
            author.firstName = row.authorFirstName;
            author.lastName = row.authorLastName;
            authors.push(author);
        });
        book.authors = authors;
        return book;
    }

    async getBooks(title:string):Promise<Book[]> {
        const rows = await this.query(this.getSelectBooksByTitleSQL(title));
        const bookMap = new Map<number, Book>();
        
        rows.forEach(row=>{
            if(!bookMap.has(row.bookId)) { 
                const newBook = new Book();
                newBook.id = row.bookId;
                newBook.title = row.title;
                newBook.authors = []
                bookMap.set(row.bookId, newBook);
            }
            const book = bookMap.get(row.bookId);
            if(!row.authorId) return;
            const author = new Author();
            author.id = row.authorId;
            author.firstName = row.authorFirstName;
            author.lastName = row.authorLastName;
            book.authors.push(author);
        });
        const books:Array<Book> = [];
        for(const book of bookMap.values()) books.push(book);
        return books;    
    }

    private getSelectBooksSQL() {
        return `
        SELECT 
            book.id AS bookId,
            book.title AS title,
            author.id AS authorId,
            author.firstName AS authorFirstName,
            author.lastName AS authorLastName 
        FROM book
        LEFT OUTER JOIN book_authors_author ON book.id = book_authors_author.bookId
        LEFT JOIN author ON book_authors_author.authorId = author.id`;
    }

    private getSelectBookByIdSQL(id:number):string {
        return `${this.getSelectBooksSQL()} WHERE book.id = ${id}`;
    }

    private getSelectBooksByTitleSQL(title:string):string {
        if(!title.includes('%')) title = `%${title}%`
        return `${this.getSelectBooksSQL()} WHERE LOWER(book.title) LIKE LOWER('${title}')`;
    }



}