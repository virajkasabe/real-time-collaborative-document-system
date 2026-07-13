import { ENV } from '../src/config/ENV'

const port = ENV.PORT || 5001
const URL = ENV.BACKEND_URI

export const getApiContext = async(playwright) => {
    return playwright.request.newContext({
        baseURL : URL
    })
}