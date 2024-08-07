import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import userController from './controllers/userController.js';

import productController from './controllers/productController.js';
import reviewController from './controllers/reviewController.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('', userController);
app.use('/products', productController);
app.use('/reviews', reviewController);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
