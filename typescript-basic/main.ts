/** 
// 타입 정하는 법 
let size: number = 100;
size = 101;

// 기본형 
let itemName: string = '코드잇 블랙 후드';
let itemPrice: number = 129000;
let membersOnly: boolean = true;
// undefined와 null은 서로 다른 타입이다 ! 
let owner: undefined = undefined;
let seller: null = null;

// 타입이 number인 경우 
let num = 2/0; // Infinity 
let num2 = 0/0; // NaN 

// 배열
// 데이터 타입 + [] 
const cart: string[] = [] 
cart.push('c001');
cart.push('c002');
// 베열 안에 배열 가능 
const carts: string[][] = [
	['c001', 'c002'],
	['c003'],
];
// 배열의 데이터 개수를 지정하지 않았기 떄문에 오류 X 
let mySize: number[] = [167, 28];
mySize = [167, 28, 255];
mySize = [255];
mySize = [];

// 튜플 
// 개수 지정 => 튜플
// 요소 안에 데이터 타입 쓰기 
let mySize1: [number, number] = [167, 28];
mySize = [167, 28, 255];  // 오류
mySize = [255];  // 오류
mySize = [];  // 오류 
// 데이터타입 다르게 지정 가능 
let mySize2: [number, number, string] = [167, 28, '29inch']

// 객체 
let product: {
    id: string;
    name: string;
    price: number;
    membersOnly?: boolean;
    sizes: string[];
} = {
    id: 'c001',
    name: '코드잇 블랙 후디',
    price: 129000,
    sizes: ['M', 'L', 'XL'],
};

if (product.membersOnly) {
    console.log('회원 적용 상품');
} else {
    console.log('일반 상품');
}

// 요소 값에 타입만 지정
let stock: {
	[id: string]: number;
};

let stock2: {
	[id: string]: number;
} = {
	c001: 3,
	c002: 0,
	c003: 1,
};

// any
const product1: any = {
    id: 'c001',
    name: '코드잇 블랙 후디',
    price: 129000,
    sizes: ['M', 'L', 'XL'],
};

console.log(product1.reviews[2]); // 오류 X (자바스크립트처럼)

// 어쩔 수 없이 any 타입인 경우 
const parsedProduct = JSON.parse(
    '{ "name": "코드잇 토트백","price": 12000 }'
);

// 타입 지정 (1) 
const parsedProduct1: {
    name: string,
    price: string,
} = JSON.parse(
    '{ "name": "코드잇 토트백","price": 12000 }'
);

// 타입 지정 (2) 
const parsedProduct2 = JSON.parse(
    '{ "name": "코드잇 토트백","price": 12000 }'
) as {
    name: string,
    price: string,
};

// 타입 지정(3) => 프론트에서도 <> 많이 사용해서 문법적인 문제로 잘 사용 X 
const parsedProduct3 = <{
    name: string,
    price: string,
}>JSON.parse(
    '{ "name": "코드잇 토트백","price": 12000 }'
);

// 함수 
const codeitmall: {
    stock: { [id: string]: number };
    cart: string[];
    addToCart: (id: string, quantity?: number) => boolean;
    addManyToCart: (...ids: string[]) => void;
} = {
    stock: {
        c001: 3,
        c002: 1,
    },
    cart: [],
    addToCart, 
    addManyToCart, 
}; 

function addToCart(id: string, quantity?: number) {
    if (!quantity) {
        quantity = 1;
    }

    if (codeitmall.stock[id] < quantity) {
        return false; 
    }

    codeitmall.stock[id] -= quantity;
    for (let i = 0; i < quantity; i++) {
        codeitmall.cart.push(id);
    }

    return true;
};

function addManyToCart(...ids: string[]) {
    for (const id of ids) {
        addToCart(id);
    }
}

// enum 
enum Size {
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
}

let product2: {
    id: string,
    name:string,
    price: number;
    membersOnly?: boolean;
    sizes: Size[];
} = {
    id: 'c001',
    name: '코드잇 블랙 후디',
    price: 129000,
    sizes: [Size.M, Size.L], 
}; 

console.log(Size.S);   
console.log(Size.M);   
console.log(Size.L);   
console.log(Size.XL);  

// interface
interface Product {
    id: string;
    name: string;
    price: number;
    membersOnly?: boolean;
}

interface ClothingProduct extends Product {
    sizes: Size[];
}

const product3: ClothingProduct = {
    id: 'c001',
    name: '코드잇 블랙 후디 집업',
    price: 129000,
    membersOnly: true,
    sizes: [Size.M, Size.L],
};

const product4: Product = {
    id: 'd001',
    name: '코드잇 텀블러',
    price: 35000,
} 

interface PrintProductFunction {
    (product: Product): void;
}

const printProduct: PrintProductFunction = (product) => {
    console.log(`${product.name}의 가격의 ${product.price}원입니다.`)
}

// 리터럴 타입 
let productName1 = '코드잇 블랙 후드';
const productName2 = '코드잇 텀블러';

let small = 95;
const large = 100;

function printSize(size: number) {
    console.log(`${size} 사이즈입니다.`);
}

printSize(small);
printSize(large);

// 타입 별칭 
type Cart = string[];
type CartResultCallback = (result: boolean) => void;
type Product2 = {
    ud: string;
    name: string;
}

const cart2: Cart = [
    'c001',
    'c002',
    'c003',
];

interface User {
    username: string;
    email: string;
    cart2: Cart;
}

const user: User = {
    username: 'codeit',
    email: 'typescript@codeit.kr',
    cart2,
}

// Union 타입 
enum ClothingSize {
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
}

interface Product {
    id: string;
    name: string;
    price: number;
    membersOnly?: boolean;
}

interface ClothingProduct extends Product {
    sizes: ClothingSize[];
    color: string;
}

type ShoeSize = 220 | 225 | 230 | 235 | 240 | 245 | 250 | 255 | 260 | 265 | 270 | 275 | 280;

interface ShoeProduct extends Product {
    sizes: ShoeSize[];
    handmade: boolean;
}

function printSizes(product: ClothingProduct | ShoeProduct) {
    const availableSizes = product.sizes.join(', ');
    console.log(`구매 가능한 사이즈는 다음과 같습니다: ${availableSizes}`);
    
    if ('color' in product) {
        console.log(`색상: ${product.color}`);
    }

    if ('handmade' in product) {
        console.log(
            product.handmade
                ? '이 상품은 장인이 직접 만듭니다.'
                : '이 상품은 공장에서 만들어졌습니다.'
        );
    }
}

const product: ClothingProduct = {
    id: 'c001',
    name: '코드잇 블랙 후드 집업',
    price: 129000,
    membersOnly: true,
    sizes: [ClothingSize.M, ClothingSize.L],
    color: 'black',
}

// Intersection 타입 
interface Id {
    id: string;
}

interface Timestamp {
    createdAt: Date;
    updatedAt: Date;
}

type Product = Id & {
    name: string;
    price: number;
    membersOnly?: boolean;
}

type User = Id & Timestamp & {
    username: string;
    email:string;
}

type Review = Id & Timestamp & {
    productId: string; 
    userId: string;
    content: string;
}

// 상속하는 방법 
interface Entity {
    id: string;
}

interface TimestampEntity extends Entity {
    createdAt: Date;
    updatedAt: Date;
}

interface Product extends Entity {
    name: string;
    price: number;
    membersOnly?: boolean;
}

interface User extends TimestampEntity {
    username: string;
    email:string;
}

interface Review extends TimestampEntity {
    productId: string; 
    userId: string;
    content: string;
}
*/
// keyof 연산자  
interface Product {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    membersOnly?: boolean;
}

// type ProductProperty = 'id' | 'name' | 'price' | 'salePrice' | 'membersOnly';
//type ProductProperty = keyof Product;

//const productTabelKeys: ProductProperty[] = ['name', 'price', 'salePrice', 'membersOnly'];
const productTabelKeys: (keyof Product)[] = ['name', 'price', 'salePrice', 'membersOnly'];


const product: Product = {
    id: 'c001',
    name: '코드잇 블랙 후드 집업',
    price: 129000,
    salePrice: 98000,
    membersOnly: true,
};

for (let key of productTabelKeys) {
    console.log(`${key} | ${product[key]}`);
}

// typeof 연산자
let product2: typeof product;

console.log(typeof product);