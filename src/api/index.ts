import { Router } from 'express';
import test from './routes/test';
import user from './routes/user';

export default () => {
	const app = Router();
	test(app);
	user(app);

	return app
}