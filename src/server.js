import express from 'express';
import db from './config/db/db.js'
import routerInit from './routers/router.js';
import 'dotenv/config';
import checkLogin from './app/middlewares/checkLogin.js';
import cors from 'cors';
const app = express();
const port = process.env.PORT ?? 5000;

db.connect();
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(checkLogin)


routerInit(app);

app.listen(port, () => {
    console.log('Web running on port ' + port)
})