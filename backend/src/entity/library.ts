import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Book } from "./books";

@Entity()
export class Library extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    position: string;

    @OneToMany(type => Book, book => book.library, {
        cascade: true
    })
    book: Book[];
}