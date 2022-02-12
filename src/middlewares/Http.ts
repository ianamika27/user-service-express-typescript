/**
 * Defines all the requisites in HTTP
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import { Application } from 'express';

import cors from "cors"
import flash from "express-flash";
import compress from "compression";
import bodyParser from "body-parser";
import session from "express-session";
// const { MongoStore  } = require('connect-mongo');
const { expressValidator } = require('express-validator');

import Locals from '../providers/Locals';

//const MongoStore = connect(session);

class Http {
    public static mount(_express: Application): Application {
        console.log('Booting the \'HTTP\' middleware...');
        // Enables the request body parser
        _express.use(bodyParser.json({
            limit: Locals.config().maxUploadLimit
        }));

        _express.use(bodyParser.urlencoded({
            limit: Locals.config().maxUploadLimit,
            parameterLimit: Locals.config().maxParameterLimit,
            extended: false
        }));

        // Disable the x-powered-by header in response
        _express.disable('x-powered-by');

        // Enables the request payload validator
      // _express.use(expressValidator());

        // Enables the request flash messages
        _express.use(flash());

        /**
         * Enables the session store
         *
         * Note: You can also add redis-store
         * into the options object.
         */
        // const options = {
        //     resave: true,
        //     saveUninitialized: true,
        //     secret: Locals.config().appSecret,
        //     cookie: {
        //         maxAge: 1209600000 // two weeks (in ms)
        //     },
        //     store: new MongoStore({
        //         url: process.env.MONGOOSE_URL,
        //         autoReconnect: true
        //     })
        // };

        // _express.use(session(options));

        // Enables the CORS
        _express.use(cors());

        // Enables the "gzip" / "deflate" compression for response
        _express.use(compress());

        // Loads the passport configuration
        // _express = Passport.mountPackage(_express);

        return _express;
    }
}

export default Http;
