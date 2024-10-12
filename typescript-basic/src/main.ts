import Product from "./types/Product";
import Size from "./types/Size";

const product1: Product = {
    id: 'c001',
    name: '코드잇 블랙 후드 집업',
    price: 129000,
    membersOnly: true,
    sizes: [Size.S,  Size.M],
};

const product2: Product = {
    id: 'd001',
    name: '코드잇 텀블러',
    price: 25000,
};

console.log(product1);
console.log(product2);