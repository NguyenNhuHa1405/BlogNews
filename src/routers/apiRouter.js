import express from 'express';
const router = express.Router();
import apiController from '../app/controllers/apiController.js';
import authorization from '../app/middlewares/authorization.js'
router.get('/', apiController.getAllNews);
router.get('/:id', authorization, apiController.getDetailsNews);
router.post('/add', authorization, apiController.addNews);

export default router
