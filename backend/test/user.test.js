

// ?? -- register
import { registerUser } from "../src/module/auth/auth.controller";


describe("userRegister", () => {
   
    it("should create a user ",  async() => {
        const user = await registerUser()
    });

}); 

// ?? -- login


// ?? -- get me


// ?? -- logout

