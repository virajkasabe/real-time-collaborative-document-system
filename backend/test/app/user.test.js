import { getApiContext } from './comman'

describe('User', () => { 
    beforeAll(async ({ playwright }) => {
        apiContext = await getApiContext(playwright);
        // TODO : You can add other test cases like
        // ?? 1. ClearDB()
        // ?? 2. apiContext.dispose()
    });

        

 })

