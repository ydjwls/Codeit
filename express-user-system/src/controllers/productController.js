import express from 'express';

import productService from '../services/productService.js';

const productController = express.Router();

productController.post('/', async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productController.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productController;
