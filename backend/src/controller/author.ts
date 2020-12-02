import { Router, Request, Response, response } from 'express';
import { Author } from '../entity/author';

const router = Router();

async function listAuthor(request: Request, response: Response) {
    response.json(await Author.find());
}

async function getAuthor(request: Request, response: Response) {
    response.json(await Author.findOne({ where: { name: request.params.authorName } }));
}

async function getAuthorBook(req: Request, res: Response) {
    let author = Author.findOne({ where: { name: req.params.authorName } });
    if (!author) {
        res.status(404).json({ msg: "author dose not exists" });
    }
    res.json(author)
}

router.route('/')
    .get(listAuthor);

router.route('/:authorName')
    .get(getAuthor);

router.route('/:authorName/book')
    .get(getAuthorBook);

export default router;