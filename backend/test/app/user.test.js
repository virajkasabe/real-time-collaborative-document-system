import { getApiContext } from './comman'
import { clearDB } from '../db';

describe('User', () => { 
    beforeAll(async ({ playwright }) => {
        apiContext = await getApiContext(playwright);
        await clearDB()
    });

    beforeAll(async({})=>{
        await apiContext.dispose()
    })

    test.describe("POST:/api/v1/rtcds/auth -FOR USERS",() => {
        // user register 
        test("should create User with valid fullName, email & password", async()=>{
            const user = {
                fullName : "Greate Example",
                email : "greateexample@gmail.com",
                password : "Greate@123"
            }

            const res = await apiContext.post('/api/v1/rtcds/auth/register',{
                data : user
            })

            const json = await res.json();
            expect(res.status()).toEqual(201);
            expect(json.statusCode).toEqual(201);
            expect(json.data).toMatchObject(user);
            userId = json.data._id;
        })
    })

        

 })

