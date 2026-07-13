import { otpGenerator } from "../src/utils/helper";

describe("OtpTester", ()=>{
   
    it("should generate otp ",  async() => {
        const otp = otpGenerator()
        console.log("otp", otp)
    });

}); 