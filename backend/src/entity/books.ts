import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    ManyToOne,
    ManyToMany,
} from 'typeorm'
import { Author } from './author';
import { BorrowRecord } from './borrowRecord';
import { Library } from './library';

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(type => BorrowRecord, borrowRecord => borrowRecord.book)
    borrowRecord: BorrowRecord[];

    @ManyToMany(type => Author, author => author.book)
    author: Author[];

    @ManyToOne(type => Library, library => library.book)
    library: Library;
}


