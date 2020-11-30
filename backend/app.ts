import express, { NextFunction, Response } from 'express'
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';
import author from './src/controller/author';
import library from './src/controller/library';
import user from './src/controller/user';
import books from './src/controller/books';
import expressJwt from 'express-jwt';
import { IUserRequest } from './src/types/request';

createConnection().then(connection => {
    // Our Express APP config
    const app = express();

    app.set("port", process.env.PORT || 3000);

    app.use(expressJwt({ secret: 'book-manager', algorithms: ['HS256'] })
        .unless({ path: ['/api/user/login', '/api/user'] }));

    app.use((err: any, req: IUserRequest, res: Response, next: NextFunction): any => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('invalid token')
        }
    })

    app.use(bodyParser.json());

    app.use('/api/library', library);
    app.use('/api/author', author);
    app.use('/api/user', user);
    app.use('/api/book', books)

    const server = app.listen(app.get("port"))

    console.log(`App is running on http://localhost:${app.get("port")} in ${app.get("env")} mode`);
}).catch(err => {
    console.log(err)
})
