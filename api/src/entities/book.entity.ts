import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Author } from "./author.entity";

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:string

    @Column()
    title:string;

    @ManyToMany(type => Author, author => author.books,{
        eager: true
    })
    @JoinTable()
    authors:Array<Author>
}