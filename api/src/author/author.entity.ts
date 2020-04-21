import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Book } from "src/book/book.entity";

@Entity()
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    firstName:string;

    @Column()
    lastName: string;

    @ManyToMany(type => Book, book => book.authors)
    books:Array<Book>
}