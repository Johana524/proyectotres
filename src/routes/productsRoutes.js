const { Router } = require('express');
const router = Router();

const {
    productsList,
    productById,
    updateProduct,
    deleteProductById,
    createProduct
} = require('../controllers/productsControllers');

const {
    validateJWT,
    validateRoleAdmin,
    userActive,
    productParams,
    existsProductId
} = require('../middlewares/middlewares');


router.get('/list', productsList);
router.get('/:idProduct', existsProductId, productById);
router.post('/admin/create', [validateJWT, userActive, validateRoleAdmin, productParams], createProduct);
router.put('/admin/:idProduct', [validateJWT, userActive, validateRoleAdmin, existsProductId, productParams], updateProduct);
router.delete('/admin/:idProduct', [validateJWT, userActive, validateRoleAdmin, existsProductId], deleteProductById);


module.exports = router;