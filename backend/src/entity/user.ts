import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BorrowRecord } from "./borrowRecord";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
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
}
