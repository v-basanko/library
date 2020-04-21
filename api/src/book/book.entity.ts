import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Author } from "src/author/author.entity";

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string;

    @ManyToMany(type => Author, author => author.books)
    @JoinTable()
    authors:Array<Author>
}