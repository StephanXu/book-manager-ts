import { Router, Request, Response, response } from 'express';
import { Author } from '../entity/author';
const router = Router();

router.route('/')
    .get(async (request: Request, response: Response) => {
        response.json(await Author.find());
    });

router.route('/:authorName')
    .get(async (request: Request, response: Response) => {
        response.json(await Author.findOne({ where: { name: request.params.authorName } }));
    });

router.route('/:authorName/book')
    .get(async (req: Request, res: Response) => {
        let author = Author.findOne({ where: { name: req.params.authorName } });
        if (!author) {
            res.status(404).json({ msg: "author dose not exists" });
        }
        res.json(author)
    });

export default router;