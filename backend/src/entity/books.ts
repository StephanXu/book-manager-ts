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
import { User } from './user';

@Entity()
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(type => BorrowRecord, borrowRecord => borrowRecord.book)
    borrowRecord: BorrowRecord[];

    @ManyToOne(type => User, user => user.book)
    reader: User | null;

    @ManyToMany(type => Author, author => author.book, {
        cascade: true
    })
    author: Author[];

    @Column()
    cover: string;

    @ManyToOne(type => Library, library => library.book)
    library: Library;
}


