/*
    Auth Routes

    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const router = Router();
const { validateJwt } = require('../middlewares/validate-jwt');

router.post(
  '/new',
  [
    // Middlewares
    check('name', 'Name must be provided').not().isEmpty(),
    check('email', 'Email must be provided').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    validateFields,
  ],
  createUser
);

router.post(
  '/',
  [
    // Middlewares
    check('email', 'Email must be provided').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    validateFields,
  ],
  loginUser
);

router.get('/renew', validateJwt, revalidateToken);

module.exports = router;
