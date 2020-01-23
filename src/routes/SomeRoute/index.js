import { Router } from 'express';
// import { celebrate, Joi } from 'celebrate';
import viewOneRoute from './view-one';

const router = Router({ mergeParams: true });

router.get(
	'/',
	// celebrate({
	// 	query: {
	// 		id: Joi.string()
	// 	}
	// }),
	viewOneRoute
);

export default router;
