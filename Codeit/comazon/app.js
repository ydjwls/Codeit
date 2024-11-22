import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { assert } from 'superstruct';
import {
  CreateUser,
  PatchUser,
  CreateProduct,
  PatchProduct,
  CreateOrder,
  PatchOrder,
  PostSavedProduct,
} from './structs.js';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === 'StructError' ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/*********** users ***********/

app.get('/users', asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest' } = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }
  const users = await prisma.user.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    include: {
      userPreference: {
        select: {
          receiveEmail: true,
        },
      },
    },
  });
  res.send(users);
}));

app.get('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      userPreference: true,
    },
  });
  res.send(user);
}));

app.post('/users', asyncHandler(async (req, res) => {
  assert(req.body, CreateUser);
  const { userPreference, ...userFields } = req.body;
  const user = await prisma.user.create({
    data: {
      ...userFields,
      userPreference: {
        create: userPreference,
      },
    },
    include: {
      userPreference: true,
    },
  });
  res.status(201).send(user);
}));

app.patch('/users/:id', asyncHandler(async (req, res) => {
  assert(req.body, PatchUser);
  const { id } = req.params;
  const { userPreference, ...userFields } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...userFields,
      userPreference: {
        update: userPreference,
      },
    },
    include: {
      userPreference: true,
    },
  });
  res.status(201).send(user);
}));

app.delete('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
}));

app.get('/users/:id/saved-products', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { savedProducts } = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      savedProducts: true,
    },
  });
  res.send(savedProducts);
}));

app.post('/users/:id/saved-products', asyncHandler(async (req, res) => {
  assert(req.body, PostSavedProduct);
  const { id: userId } = req.params;
  const { productId } = req.body;
  const { savedProducts } = await prisma.user.update({
    where: { id: userId },
    data: {
      savedProducts: {
        connect: {
          id: productId,
        },
      },
    },
    include: {
      savedProducts: true,
    },
  });
  res.send(savedProducts);
}));

/*********** products ***********/

app.get('/products', asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest', category } = req.query;
  let orderBy;
  switch (order) {
    case 'priceLowest':
      orderBy = { price: 'asc' };
      break;
    case 'priceHighest':
      orderBy = { price: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
  }
  const where = category ? { category } : {};
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.send(products);
}));

app.get('/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  res.send(product);
}));

app.post('/products', asyncHandler(async (req, res) => {
  assert(req.body, CreateProduct);
  const product = await prisma.product.create({
    data: req.body,
  });
  res.status(201).send(product);
}));

app.patch('/products/:id', asyncHandler(async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.send(product);
}));

app.delete('/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
}));

/*********** orders ***********/

app.get('/orders', asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany();
  res.send(orders);
}));

app.get('/orders/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      orderItems: true,
    },
  });
  let total = 0;
  order.orderItems.forEach((orderItem) => {
    total += orderItem.unitPrice * orderItem.quantity;
  });
  order.total = total;
  res.send(order);
}));

app.post(
  '/orders',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateOrder);
    const { userId, orderItems } = req.body;

    const productIds = orderItems.map((orderItem) => orderItem.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    function getQuantity(productId) {
      const orderItem = orderItems.find(
        (orderItem) => orderItem.productId === productId
      );
      return orderItem.quantity;
    }

    // 재고 확인
    const isSufficientStock = products.every((product) => {
      const { id, stock } = product;
      return stock >= getQuantity(id);
    });

    if (!isSufficientStock) {
      throw new Error('Insufficient Stock');
    }

    // Order 생성하고 재고 감소
    const queries = productIds.map((productId) =>
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: getQuantity(productId) } },
      })
    );

    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          orderItems: true,
        },
      }),
      ...queries,
    ]);

    res.status(201).send(order);
  })
);

app.patch('/orders/:id', asyncHandler(async (req, res) => {
  assert(req.body, PatchOrder);
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id },
    data: req.body,
  });
  res.send(order);
}));

app.delete('/orders/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id } });
  res.sendStatus(204);
}));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
