import { otpGenerator } from "../src/utils/helper";

describe("OtpTester", ()=>{
   
    it("should create a user ",  async() => {
        const otp = otpGenerator()
        console.log("otp", otp)
    });

}); 