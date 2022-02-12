import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {

    public static config(): any {
		dotenv.config({ path: path.join(__dirname, '../../.env') });

		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 4040;
        const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
		const mongooseUrl = process.env.MONGOOSE_URL;
        const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || 100000;

        const apiPrefix = process.env.API_PREFIX || 'api';
        const apiVersion = process.env.API_VERSION || 'v1';

        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		
		return {
            appSecret,
            apiPrefix,
            apiVersion,
			mongooseUrl,
            port,
            url,
            maxUploadLimit,
            maxParameterLimit,
            jwtExpiresIn
		};
	}
    /**
     * Injects your config to the app's locals
     */
    public static init (_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;