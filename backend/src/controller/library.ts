import { Router, Request, Response } from 'express'
import { Author } from '../entity/author';
import { Book } from '../entity/books';
import { Library } from '../entity/library'

const router = Router();

interface AddLibraryRequest {
    name: string,
    position: string
};

interface BookReq {
    title: string;
    author: string[];
    library: string;
};

router.route('/')
    .get(async (request: Request, response: Response) => {
        response.json(await Library.find());
    })
    .post(async (request: Request, response: Response) => {
        let req: AddLibraryRequest = request.body;

        let lib = new Library;
        lib.name = req.name;
        lib.position = req.position;
        await lib.save();

        response.json(lib);
    });

router.route('/:library')
    .delete(async (req: Request, res: Response) => {
        let id = req.params.library;

        let library = await Library.findOne({ where: { id: id } });
        await library?.remove();
        res.status(200).send();
    });

router.route('/:library/book')
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

export default router;