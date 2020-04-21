import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Author } from 'src/author/author.entity';
import { Book } from 'src/book/book.entity';

export const typeOrmConfig:TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [Author, Book],
    synchronize: true
}