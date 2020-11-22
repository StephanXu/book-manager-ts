import {MigrationInterface, QueryRunner} from "typeorm";

export class InitMigration1606053000688 implements MigrationInterface {
    name = 'InitMigration1606053000688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL, "birthday" TIMESTAMP NOT NULL, "role" character varying NOT NULL, "telephone" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "borrow_record" ("id" SERIAL NOT NULL, "time" TIMESTAMP NOT NULL, "bookId" integer, "readerId" integer, CONSTRAINT "PK_bed177a8cdcca94d5adeebdc52c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "library" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "position" character varying NOT NULL, CONSTRAINT "PK_3a61ae2e897d9b5a59a64e91aa4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "libraryId" integer, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author_book_book" ("authorId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_9c7071feee67d224a4e145e8d35" PRIMARY KEY ("authorId", "bookId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a64aac48a57ec47266c14eb335" ON "author_book_book" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f632e855ab3934ed0b35b5cb08" ON "author_book_book" ("bookId") `);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_8032acbf1eb063876edcf49e96c" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "borrow_record" ADD CONSTRAINT "FK_75728057daeea70b42e5ca3ede0" FOREIGN KEY ("readerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_da052b08a5b50d4601bb0f15ac0" FOREIGN KEY ("libraryId") REFERENCES "library"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_book_book" ADD CONSTRAINT "FK_a64aac48a57ec47266c14eb3354" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "author_book_book" ADD CONSTRAINT "FK_f632e855ab3934ed0b35b5cb08e" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author_book_book" DROP CONSTRAINT "FK_f632e855ab3934ed0b35b5cb08e"`);
        await queryRunner.query(`ALTER TABLE "author_book_book" DROP CONSTRAINT "FK_a64aac48a57ec47266c14eb3354"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_da052b08a5b50d4601bb0f15ac0"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_75728057daeea70b42e5ca3ede0"`);
        await queryRunner.query(`ALTER TABLE "borrow_record" DROP CONSTRAINT "FK_8032acbf1eb063876edcf49e96c"`);
        await queryRunner.query(`DROP INDEX "IDX_f632e855ab3934ed0b35b5cb08"`);
        await queryRunner.query(`DROP INDEX "IDX_a64aac48a57ec47266c14eb335"`);
        await queryRunner.query(`DROP TABLE "author_book_book"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "library"`);
        await queryRunner.query(`DROP TABLE "borrow_record"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
