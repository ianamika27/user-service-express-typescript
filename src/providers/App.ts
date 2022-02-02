import * as path from 'path';
import * as dotenv from 'dotenv';

import Express from './Express';
import { Database } from './database';

class App {

    public loadConfiguration (): void {
        console.log('Configuration :: Booting @ Master...');
		dotenv.config({ path: path.join(__dirname, '../../.env') });
	}

    // Loads your Server
	public loadServer (): void {
		console.log('Server :: Booting @ Master...');
		Express.init();
	}

	// Loads the Database Pool
	public loadDatabase (): void {
		console.log('Database :: Booting @ Master...');
		Database.init();
	}
}

export default new App;