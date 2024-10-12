"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Size_1 = __importDefault(require("./types/Size"));
const product1 = {
    id: 'c001',
    name: '코드잇 블랙 후드 집업',
    price: 129000,
    membersOnly: true,
    sizes: [Size_1.default.S, Size_1.default.M],
};
const product2 = {
    id: 'd001',
    name: '코드잇 텀블러',
    price: 25000,
};
console.log(product1);
console.log(product2);
