import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./books";
import { BorrowRecord } from "./borrowRecord";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column()
    birthday: Date;

    @Column()
    role: string;

    @Column()
    telephone: string;

    @OneToMany(type => BorrowRecord, borrowRecord => borrowRecord.reader, {
        cascade: true
    })
    borrowRecord: BorrowRecord[];

    @OneToMany(type => Book, book => book.reader, {
        cascade: true
    })
    book: Book[];
}
