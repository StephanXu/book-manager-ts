import { Router, Request, Response } from 'express'
import { Book } from '../entity/books';
const router = Router()

router.route('/')
    .get(async (request: Request, response: Response) => {
        let books = await Book.findAndCount();
        console.log(books)
        response.send();
    })
    .post((request: Request, response: Response) => {
        // let book = new Book();
        console.log(request.body)
    })


export default router;