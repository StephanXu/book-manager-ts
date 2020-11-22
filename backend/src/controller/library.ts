import { Router, Request, Response } from 'express'
import { Library } from '../entity/library'
import books from './books';

const router = Router();

type AddLibraryRequest = {
    name: string,
    position: string
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
    });

router.use('/:library/book', books)

export default router;