import { Router } from 'express';
import test from './routes/test';

export default () => {
	const app = Router();
	test(app);

	return app
}