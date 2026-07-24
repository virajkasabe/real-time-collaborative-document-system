import { test, expect } from '@playwright/test';
import { clearDB } from '../db.js';
import { getApiContext } from '../comman.js';

let apiContext;
let userId;

test.describe('User', () => {
    test.beforeAll(async ({ playwright }) => {
        apiContext = await getApiContext(playwright);
        await clearDB();
    });

    test.afterAll(async () => {
        if (apiContext) {
            await apiContext.dispose();
        }
    });

    test.describe('POST: /api/v1/rtcds/auth - FOR USERS', () => {
        test('should create user with valid fullName, email & password', async () => {
            const user = {
                fullName: 'Great Example',
                email: 'greatexample@gmail.com',
                password: 'Great@123'
            };

            const res = await apiContext.post('/register', {
                data: user
            });

            const json = await res.json();

            expect(res.status()).toBe(201);
            expect(json.statusCode).toBe(201);
            expect(json.data).toMatchObject({
                fullName: user.fullName,
                email: user.email
            });
            expect(json.data.password).toBeUndefined();

            userId = json.data._id;
            expect(userId).toBeDefined();
        });
    });
});