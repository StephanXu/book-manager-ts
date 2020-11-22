import express from 'express'
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';
import author from './src/controller/author';
import library from './src/controller/library';

createConnection().then(connection => {
    // Our Express APP config
    const app = express();

    app.set("port", process.env.PORT || 3000);
    app.use(bodyParser.json())

    app.use('/library', library);
    app.use('/author', author)

    const server = app.listen(app.get("port"))

    console.log(`App is running on http://localhost:${app.get("port")} in ${app.get("env")} mode`);
}).catch(err => {
    console.log(err)
})
