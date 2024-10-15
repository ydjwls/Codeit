import express, { Request, Response, NextFunction, RequestHandler } from 'express';

const app = express();

const handler: RequestHandler = (req,res, next) => {
    res.send();
    req.cookies
};


app.get('/', handler);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
