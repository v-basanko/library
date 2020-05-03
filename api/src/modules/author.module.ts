import { Module } from '@nestjs/common';
import { AuthorService } from 'src/services';
import { AuthorResolver } from 'src/resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorRepository } from 'src/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorRepository])],
  providers: [
    AuthorResolver,
    AuthorService
  ]
})
export class AuthorModule {}
