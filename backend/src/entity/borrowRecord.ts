import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./books";
import { User } from "./user";

@Entity()
export class BorrowRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Book, book => book)
    book: Book;

    @ManyToOne(type => User, user => user.borrowRecord)
    reader: User;

    @Column()
    time: Date;
}