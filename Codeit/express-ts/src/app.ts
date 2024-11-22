import express, { RequestHandler } from 'express';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

const handler: RequestHandler = (req, res, next) => {
  res.send();
};

const middleware: RequestHandler = (req, res, next) => {
    req.valid = true;
    next();
};

app.get('/', handler);

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send();
});

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});