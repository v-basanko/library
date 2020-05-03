import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Book } from "./book.entity";

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