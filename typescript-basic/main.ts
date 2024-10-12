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