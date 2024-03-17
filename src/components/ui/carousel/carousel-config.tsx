import { faker } from '@faker-js/faker';

type User = {
    userId: string;
    username: string;
    email: string;
    avatar: string;
    password: string;
    birthdate: Date;
    registeredAt: Date;
};

function createRandomUser(): User {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    };
}

export const USERS: User[] = faker.helpers.multiple(createRandomUser, {
    count: 5,
});

