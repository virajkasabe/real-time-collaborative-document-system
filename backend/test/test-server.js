import { httpServer } from '../src/app';
import { ENV } from '../src/config/ENV';
import { connectedDBForTesting } from './db';

const PORT = ENV.PORT || 5003

const startServer = () => {
    httpServer.listen(PORT, () => {
        console.info( `Visit the documentation at: http://localhost:${PORT}`)
        console.log(`Server Listning on port : ${PORT}`)
    })
}


await connectedDBForTesting();
await startServer();