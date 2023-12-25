import express from 'express';

import { getUsers, getUsersBySearch, updateUser, deleteUser } from '../controllers/users.js';

const router = express.Router();
router.get('/', getUsers);
router.get('/search', getUsersBySearch);
router.post('/update', updateUser);
router.post('/delete', deleteUser);

export default router;