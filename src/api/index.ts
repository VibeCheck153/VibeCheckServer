import { Router } from 'express';
import test from './routes/test';
import user from './routes/user';
import venue from './routes/venue';

export default () => {
	const app = Router();
	test(app);
	user(app);
	venue(app);

	return app
}