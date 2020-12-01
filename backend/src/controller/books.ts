import { Router, Request, Response } from 'express'
import { getManager } from 'typeorm';
import { Book } from '../entity/books';
import { BorrowRecord } from '../entity/borrowRecord';
import { User } from '../entity/user';
import { IUserRequest } from '../types/request';
const router = Router({ mergeParams: true })

class BookReq {
    title: string;
    author: string[];
    library: string;
};

async function removeBook(req: Request, res: Response) {
    let book = await Book.findOne({ where: { id: req.params.bookId } });
    if (!book) {
        res.status(404).json({ msg: "book dose not exist" });
    }
    await book?.remove();
}

async function borrowBook(req: Request, res: Response) {
    let book = await Book.findOne({
        where: { id: req.params.bookId },
        relations: ['reader']
    });
    if (!book) {
        res.status(404).json({ msg: "book dose not exist" });
        return;
    }
    if (book.reader != null) {
        res.status(400).json({ msg: "book dose not available" })
        return;
    }
    let user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
        res.status(404).json({ msg: "user dose not exist" });
        return;
    }
    book.reader = user;
    let record = new BorrowRecord;
    record.book = book;
    record.reader = user;
    record.time = new Date(Date.now());
    record.direction = true;
    await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(record);
        await transactionalEntityManager.save(book);
    });
    res.status(200).send();
}

async function returnBook(req: IUserRequest, res: Response) {
    let book = await Book.findOne({
        where: { id: req.params.bookId },
        relations: ['reader']
    });
    if (!book) {
        res.status(404).json({ msg: "book dose not exist" });
        return;
    }
    if (book.reader == null) {
        res.status(400).json({ msg: "failed" })
        return;
    }
    let user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
        res.status(404).json({ msg: "user dose not exist" });
        return;
    }
    book.reader = null;
    let record = new BorrowRecord;
    record.book = book;
    record.reader = user;
    record.time = new Date(Date.now());
    record.direction = false;
    await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(record);
        await transactionalEntityManager.save(book);
    });
    res.status(200).send();
}

async function listBorrowRecord(req: IUserRequest, res: Response) {
    let book = await Book.findOne({
        where: { id: req.params.bookId },
        relations: ['borrowRecord']
    });
    if (!book) {
        res.status(404).json({ msg: "book dose not exist" });
        return;
    }
    res.status(200).json(book.borrowRecord);
}

router.route('/:bookId')
    .delete(removeBook);

router.route('/:bookId/reader/:userId')
    .post(borrowBook)
    .delete(returnBook)

router.route('/:bookId/record')
    .post(listBorrowRecord);

export default router;