import mongoose from "mongoose";
import bluebird from 'bluebird';
import { MongoError } from 'mongodb';

import Locals from './Locals';

export class Database {
	// Initialize your database pool
	public static init (): any {
		const dsn = Locals.config().mongooseUrl;
		const options = { 
            //useNewUrlParser: true, 
            //useUnifiedTopology: true 
        };

		(<any>mongoose).Promise = bluebird;

		// mongoose.set('useCreateIndex', true);

		mongoose.connect(dsn, options, (error) => {
			// handle the error case
			if (error) {
				console.log('Failed to connect to the Mongo server!!');
				console.log(error);
				throw error;
			} else {
				console.log('\x1b[33m%s\x1b[0m','MONGO Server :: Running @ ' + dsn);
			}
		});
	}
}

export default mongoose;