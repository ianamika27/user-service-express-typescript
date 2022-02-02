import * as express from 'express';

import Locals from './Locals';


class Express {
    /**
     * Create the express object
     */
    public express: express.Application;

    /**
     * Initializes the express server
     */
    constructor () {
        this.express = express();

        this.mountDotEnv();
        
    }

    private mountDotEnv (): void {
        this.express = Locals.init(this.express);
    }

    /**
     * Starts the express server
     */
    public init (): any {
        const port: number = Locals.config().port;

        // Registering Exception / Error Handlers
       
        // Start the server on the specified port
        this.express.listen(port, () => {
           return console.log('\x1b[33m%s\x1b[0m', `Application Server :: Running @ 'http://localhost:${port}'`);
        });
    }
}

/** Export the express module */
export default new Express();
