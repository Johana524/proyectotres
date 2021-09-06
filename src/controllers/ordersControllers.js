const { db, Sequelize } = require('../../database');

const createOrder = (req, res) => {

    const { orderDescription, orderPayment, orderTotal, orderProducts } = req.body;
    const order_user_id = req.params.usuario.user_id;

    db.query('INSERT INTO orders (orderDescription, orderPayment, orderTotal, order_user_id) VALUES (?,?,?,?)', {
            type: Sequelize.QueryTypes.INSERT,
            replacements: [orderDescription, orderPayment, orderTotal, order_user_id]
        })
        .then(async result => {
            let order_id = 0;
            // traigo todas las ordenes
            let findOrder = await db.query('SELECT * FROM orders WHERE orderDescription = ? AND orderTotal = ? AND order_user_id = ?', {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [orderDescription, orderTotal, order_user_id]
            });
            // me quedo con la ultima
            order_id = findOrder.pop().order_id;

            console.log('orderproducts', orderProducts)
            orderProducts.forEach(async prod => {
                try {
                    await db.query('INSERT INTO order_detail (order_id, product_id, quantity) VALUES (?,?,?)', {
                        type: Sequelize.QueryTypes.INSERT,
                        replacements: [order_id, prod.product_id, prod.quantity]
                    })
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Error en el servidor' });
                }
            });
            res.status(201).json({ msg: 'Orden creada exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};

const updateOrder = (req, res) => {
    const { idOrder } = req.params;
    const { orderStatus } = req.body;
    db.query('UPDATE orders SET orderStatus=? WHERE order_id=?', {
            type: Sequelize.QueryTypes.UPDATE,
            replacements: [orderStatus, idOrder]
        })
        .then(result => {
            console.log(result)
            res.status(201).json({ msg: 'Order actualizada exitosamente' })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        })
};

const deleteOrder = (req, res) => {
    const { idOrder } = req.params;
    db.query('DELETE FROM orders WHERE order_id = ?', {
            type: Sequelize.QueryTypes.DELETE,
            replacements: [idOrder]
        })
        .then(result => {
            res.json({ msg: 'Orden eliminada exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};

const orders = async(req, res) => {
    // del middleware
    const result = req.params.orders;
    for (let i = 0; i < result.length; i++) {
        try {
            // order_detail+products del order_detail q tiene este order_id
            let products = await db.query('SELECT products.*, order_detail.quantity FROM order_detail JOIN products ON order_detail.product_id = products.product_id WHERE order_detail.order_id=?', {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [result[i].order_id]
            })
            result[i].orderProducts = products;
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' })
        }
    }
    res.json(result)
};

const orderById = async(req, res) => {
    const result = req.params.order;
    try {
        let products = await db.query('SELECT products.*, order_detail.quantity FROM order_detail JOIN products ON order_detail.product_id=products.product_id WHERE order_detail.order_id= ?', {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [result[0].order_id]
        })
        result[0].orderProducts = products;
        console.log(products);
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' })
    };

    res.json(result);
};

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    orders,
    orderById
};