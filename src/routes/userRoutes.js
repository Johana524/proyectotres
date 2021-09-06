const { Router } = require('express');
const router = Router();

const { accounts, register, signIn, userById, deleteUserById, updateUser } = require('../controllers/userControllers');
const {
    validateJWT,
    userActive,
    registerParams,
    signinParams,
    validateRoleAdmin,
    existsUserId,
    validateUserId
} = require('../middlewares/middlewares');

router.get('/admin/accounts', [validateJWT, userActive, validateRoleAdmin], accounts);
router.post('/register', registerParams, register);
router.post('/signin', signinParams, signIn);
router.get('/info/:idUser', [validateJWT, userActive, validateUserId], userById);
router.put('/:idUser', [validateJWT, userActive, validateUserId, existsUserId, registerParams], updateUser);
router.delete('/admin/:idUser', [validateJWT, userActive, validateRoleAdmin, validateUserId, existsUserId], deleteUserById);


module.exports = router;