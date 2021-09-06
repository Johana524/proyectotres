const { Router } = require('express');
const router = Router();

const {
    createOrder,
    updateOrder,
    deleteOrder,
    orders,
    orderById
} = require('../controllers/ordersControllers');

const {
    validateJWT,
    userActive,
    validateRoleAdmin,
    orderParams,
    statusParam,
    orderRol,
    existsOrderId
} = require('../middlewares/middlewares');

router.post('/create', [validateJWT, orderParams], createOrder);
router.put('/admin/:idOrder', [validateJWT, validateRoleAdmin, orderRol, existsOrderId, statusParam], updateOrder)
router.delete('/admin/:idOrder', [validateJWT, validateRoleAdmin, existsOrderId], deleteOrder)
router.get('/', [validateJWT, userActive, orderRol], orders);
router.get('/:idOrder', [validateJWT, userActive, existsOrderId], orderById);

module.exports = router;