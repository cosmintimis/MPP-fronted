export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
};

export type User = {
    id: number;
    username: string;
    email: string;
    avatar: string;
    password: string;
    birthdate: Date;
    rating: number;
    address: string;
    products: Product[];
    roles: string[];
};

export type UserListWithSize = {
    users: User[];
    size: number;
};
// export var USERS: User[] = [
//     {
//         id: 1,
//         username: "Cosmin Timis",
//         email: "cosmin.timis@gmail.com",
//         avatar: "https://robohash.org/e5a84795597420d98d606433f8ad1f70?set=set4&bgset=&size=400x400",
//         password: "parolaaiabuna",
//         birthdate: new Date("2003-01-01"),
//         rating: 8.8,
//         address: "address1"
//     },
//     {
//         id: 2,
//         username: "Roberto Pitic",
//         email: "roberto.pitic@gmail.com",
//         avatar: "https://robohash.org/123a37a18fdbba6a742e7446c8166393?set=set4&bgset=&size=400x400",
//         password: "parola2004",
//         birthdate: new Date("2004-01-01"),
//         rating: 9.4,
//         address: "Moisei gara"
//     },
//     {
//         id: 3,
//         username: "Alex Popescu",
//         email: "alex.popescu@gmail.com",
//         avatar: "https://robohash.org/6bce224daedfea2d8296ceb4597929b7?set=set4&bgset=&size=400x400",
//         password: "parola2004",
//         birthdate: new Date("2004-04-04"),
//         rating: 5.5,
//         address: "cluj"
//     },
//     {
//         id: 4,
//         username: "Mihai Pop",
//         email: "mihai.pop@gmail.com",
//         avatar: "https://robohash.org/3afc9b17743e55d9c40cb9a8df20517c?set=set4&bgset=&size=400x400",
//         password: "parola4",
//         birthdate: new Date("2004-05-05"),
//         rating: 7.5,
//         address: "baia mare"
//     },
//     {
//         id: 5,
//         username: "Andrei Pop",
//         email: "andrei.pop@gmail.com",
//         avatar: "https://robohash.org/7f313371cd50e8132291ef6ec2a9dc25?set=set4&bgset=&size=400x400",
//         password: "parola5",
//         birthdate: new Date("2009-06-07"),
//         rating: 7.7,
//         address: "bucuresti"
//     },
//     {
//         id: 6,
//         username: "Dragos Pop",
//         email: "dragos.pop@gmail.com",
//         avatar: "https://robohash.org/d98db5779a7d4e3257552f63bc1bdefe?set=set4&bgset=&size=400x400",
//         password: "parola6",
//         birthdate: new Date("2003-01-05"),
//         rating: 9.9,
//         address: "targu-jiu"
//     },
//     {
//         id: 7,
//         username: "Dan Pop",
//         email: "dan.pop@gmail.com",
//         avatar: "https://robohash.org/0b456df7de7f1f41c3da509934272113?set=set4&bgset=&size=400x400",
//         password: "parola7",
//         birthdate: new Date("2003-06-08"),
//         rating: 6.75,
//         address: "satu mare"
//     },
//     {
//         id: 8,
//         username: "Darius Hantig",
//         email: "darius.hantig@gmail.com",
//         avatar: "https://robohash.org/1c375eb51d2e0786a06e94d7bbf51233?set=set4&bgset=&size=400x400",
//         password: "parola8",
//         birthdate: new Date("2005-05-06"),
//         rating: 9.25,
//         address: "borsa"
//     },
//     {
//         id: 9,
//         username: "Dragos Pop",
//         email: "dragos.pop@gmail.com",
//         avatar: "https://robohash.org/1c375eb51d2e0786a06e94d7bbf51233?set=set4&bgset=&size=400x400",
//         password: "parola9",
//         birthdate: new Date("2005-08-06"),
//         rating: 9.55,
//         address: "viseu"
//     },
//     {
//         id: 10,
//         username: "Sebastian Hojda",
//         email: "sebastian.hojda@gmail.com",
//         avatar: "https://robohash.org/1c375eb51d2e0786a06e94d7bbf51233?set=set4&bgset=&size=400x400",
//         password: "parola10",
//         birthdate: new Date("2005-09-06"),
//         rating: 5.25,
//         address: "sighet"
//     },
//     {
//         id: 11,
//         username: "Gabriel Horj",
//         email: "gabriel.horj@gmail.com",
//         avatar: "https://robohash.org/1c375eb51d2e0786a06e94d7bbf51233?set=set4&bgset=&size=400x400",
//         password: "parola11",
//         birthdate: new Date("2005-02-06"),
//         rating: 6.25,
//         address: "baia borsa"
//     },
// ];




