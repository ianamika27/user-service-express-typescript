import { Application } from 'express';
import Locals from './Locals';

import authRouter from './../routes/Auth';

class Routes {
	
	public mountAuth(_express: Application): Application {
		const apiPrefix = Locals.config().apiPrefix;
		const apiVersion = Locals.config().apiVersion;
		console.log('Routes :: Mounting API Routes...');

		return _express.use(`/${apiPrefix}/${apiVersion}`, authRouter);
	}
}

export default new Routes;