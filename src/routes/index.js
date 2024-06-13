import { Router } from 'express';
import { getUsers, createUser, deleteUser, editUser } from '../controllers/userController.js';
import { loginUser } from '../controllers/loginController.js';
import { getPublications, createPublication, deletePublication, editPublication } from '../controllers/publicationController.js'
import { createComment, editComment, deleteComment } from '../controllers/commentController.js'
import { authentication } from '../config/auth.js';
import upload from '../config/multer.js';
const router = Router();

//users

router.get('/users', getUsers);

router.post('/register', createUser);

router.put('/users/:id', authentication, editUser);

router.delete('/users/:id', authentication, deleteUser);

router.post('/login', loginUser );

//posts

router.get('/publications', getPublications);

router.post('/publications', authentication, upload.single('imagen'), createPublication);

router.put('/publications/:id', authentication, upload.single('imagen'), editPublication);

router.delete('/publications/:id', authentication, deletePublication);

//comments

router.post('/comments', authentication, createComment);

router.put('/comments/:id', authentication, editComment);

router.delete('/comments/:id', authentication, deleteComment);

export default router;
