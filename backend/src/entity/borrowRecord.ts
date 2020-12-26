import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./books";
import { User } from "./user";

@Entity()
export class BorrowRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Book, book => book.borrowRecord, {
        cascade: true
    })
    @JoinTable()
    book: Book;

    @ManyToOne(type => User, user => user.borrowRecord, {
        cascade: true
    })
    @JoinTable()
    reader: User;

    @Column()
    direction: Boolean; // true for borrow

    @Column()
    time: Date;
}