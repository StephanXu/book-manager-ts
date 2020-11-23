import { Router, Request, Response } from 'express'
import { read } from 'fs';
import { Author } from '../entity/author';
import { Book } from '../entity/books';
import { BorrowRecord } from '../entity/borrowRecord';
import { Library } from '../entity/library';
import { User } from '../entity/user';
const router = Router({ mergeParams: true })

class BookReq {
    title: string;
    author: string[];
    library: string;
};

router.route('/')
    .get(async (request: Request, response: Response) => {
        let libraryId = request.params.library
        let library = await Library.findOne({
            where: { id: libraryId },
            relations: ['book']
        })
        if (!library) {
            response.status(404).send({ msg: 'Library not found' })
            return;
        }
        response.json(library?.book);
    })
    .post(async (request: Request, response: Response) => {
        let bookReq: BookReq = request.body;
        let libraryId = request.params.library
        let library = await Library.findOne({ where: { id: libraryId } })

        if (!library) {
            response.status(400).send({ msg: 'Library not found' })
            return;
        }

        let newBook = new Book;
        newBook.title = bookReq.title;
        newBook.library = library;
        newBook.reader = null;
        let authorList: Author[] = [];

        bookReq.author.forEach(async item => {
            let author = await Author.findOne({ where: { name: item }, relations: ['book'] })
            if (!author) {
                author = new Author;
                author.name = item;
            }
            authorList.push(author);
        });
        newBook.author = authorList;

        await newBook.save();
        response.status(200).send();
    });

router.route('/:bookId')
    .delete(async (req: Request, res: Response) => {
        let book = await Book.findOne({ where: { id: req.params.bookId } });
        if (!book) {
            res.status(404).json({ msg: "book dose not exist" });
        }
        await book?.remove();
    });

router.route('/:bookId/reader/:userId')
    .post(async (req: Request, res: Response) => {
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
        let record = new BorrowRecord;
        record.book = book;
        record.reader = user;
        record.time = new Date(Date.now());
        record.save();
    })

export default router;