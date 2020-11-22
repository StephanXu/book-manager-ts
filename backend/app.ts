import express from 'express'
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';
import books from './src/controller/books';

createConnection().then(connection => {
    // Our Express APP config
    const app = express();

    app.set("port", process.env.PORT || 3000);
    app.use(bodyParser.json())

    app.use('/book', books);

    const server = app.listen(app.get("port"))

    console.log(`App is running on http://localhost:${app.get("port")} in ${app.get("env")} mode`);
}).catch(err => {
    console.log(err)
})
