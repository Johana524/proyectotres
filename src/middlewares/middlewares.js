const { db, Sequelize } = require('../../database');
const jwt = require('jsonwebtoken');
const { key } = require('../config');

// JWT
function generateJWT(info) {
    const token = jwt.sign(info, key);
    return token;
};

function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, key);
        return decoded;
    } catch (error) {
        return false;
    }
}

function validateJWT(req, res, next) {
    const auth = req.headers.authorization;
    if (auth) {
        const token = auth.split(' ')[1];
        const verifyToken = verifyJWT(token);
        if (verifyToken) {
            req.params.usuario = verifyToken;
            next();
        } else {
            res.status(404).json({ error: 'El token no existe o es invalido' })
        }
    } else {
        res.status(404).json({ error: 'El Token no existe o es invalido' })
    }
};

function registerParams(req, res, next) {
    const { userCompleteName, userEmail, userPassword, userPhone, userAddress } = req.body;

    if (userCompleteName && userEmail && userPassword && userPhone && userAddress) {
        next();
    } else {
        res.status(400).json({ error: "Datos incorrectos o campos incompletos" });
    }
}

function signinParams(req, res, next) {
    const { userEmail, userPassword } = req.body;
    if (userEmail && userPassword) {
        next();
    } else {
        res.status(400).json({ error: "Datos incorrectos o campos incompletos" });
    }
};


function userActive(req, res, next) {
    const user = req.params.usuario;

    db.query('SELECT * FROM accounts WHERE user_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [user.user_id]
    }).then(result => {
        if (result[0].userActive != 0) {
            next();
        } else {
            res.status(401).json({ error: 'No existe el usuario o las credenciales son incorrectas' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
};

function existsUserId(req, res, next) {
    const { idUser } = req.params;

    db.query('SELECT * FROM accounts WHERE user_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [idUser]
    }).then(result => {
        console.log(result)
        if (result.length != 0) {
            next();
        } else {
            res.status(401).json({ error: 'No existe el usuario o las credenciales son incorrectas' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
};

function validateUserId(req, res, next) {
    const { usuario, idUser } = req.params;

    if (usuario.userAdmin == 0 && usuario.user_id == idUser) {
        next();
    } else {
        if (usuario.userAdmin == 1) {
            next();
        } else {
            res.status(401).json({ error: 'No esta autorizado para realizar esta operacion' });
        }
    }
};

function validateRoleAdmin(req, res, next) {

    const user = req.params.usuario;
    console.log(user)
    if (user.userAdmin == 1) {
        next();
    } else {
        res.status(401).json({ error: 'No esta autorizado para realizar esta operacion' });
    }
};

function validateRoleUser(req, res, next) {
    const user = req.params.usuario;
    console.log(user)
    if (user.userAdmin == 0) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized user to do this operation' });
    }
};

// function incompleteField(req, res, next) {
//     const { userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin } = req.body;

//     db.query('UPDATE accounts SET userCompleteName = if(?="undefined", userCompleteName,?), userEmail= if(?="undefined", userEmail,?), userPassword=if(?="undefined", userPassword,?),userPhone=if(?="undefined", userPhone,?), userAddress=if(?="undefined", userAddress,?), userAdmin=if(?="undefined", userAdmin,?)', {
//             type: Sequelize.QueryTypes.UPDATE,
//             replacements: [userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin]
//         }).then(result => {
//             console.log(result)
//             res.status(201).json({ msg: 'Campos seleccionados actualizados' });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ error: 'Error en el servidor' });
//         });
// };

// PRODUCTS

function productParams(req, res, next) {
    const { productName, productPrice, productDescription } = req.body;
    if (productName && productPrice && productDescription) {
        next();
    } else {
        res.status(400).json({ error: "Datos incorrectos o campos incompletos" });
    }
};

function existsProductId(req, res, next) {
    const { idProduct } = req.params;

    db.query('SELECT * FROM products WHERE product_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [idProduct]
    }).then(result => {
        console.log(result)
        if (result.length != 0) {
            next();
        } else {
            res.status(401).json({ error: 'No existe el producto o las credenciales son incorrectas' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
};

// ORDERS
function orderParams(req, res, next) {
    const { orderDescription, orderPayment, orderTotal, orderProducts } = req.body;

    if (orderDescription && orderPayment && orderTotal && orderProducts) {
        next();
    } else {
        res.status(400).json({ error: 'Datos incorrectos o campos incompletos' });
    }
};

function statusParam(req, res, next) {
    const { orderStatus } = req.body;

    if (orderStatus == 'new' || orderStatus == 'confirmed' || orderStatus == 'cooking' || orderStatus == 'sending' || orderStatus == 'canceled' || orderStatus == 'delivered') {
        next();
    } else {
        res.status(400).json({ error: 'Datos incorrectos o campos incompletos' });
    }
};

function orderRol(req, res, next) {
    const usuario = req.params.usuario;

    if (usuario.userAdmin == 0) {
        db.query('SELECT * FROM orders WHERE order_user_id= ?', {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [usuario.user_id]

        }).then(result => {
            // paso param a funcion orders
            req.params.orders = result;
            next();

        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' })
        })
    } else {
        db.query('SELECT * FROM orders', {
            type: Sequelize.QueryTypes.SELECT

        }).then(result => {
            req.params.orders = result;
            next();

        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' })
        });
    }
};

function existsOrderId(req, res, next) {
    const { usuario, idOrder } = req.params;

    db.query('SELECT * FROM orders WHERE order_id = ?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [idOrder]
    }).then(result => {
        console.log(result)
        if (result.length != 0) {
            req.params.order = result
            if (usuario.userAdmin == 0 && result[0].order_user_id == usuario.user_id) {
                next();
            } else {
                if (usuario.userAdmin == 1) {
                    next();
                } else {
                    res.status(401).json({ error: 'No esta autorizado para realizar esta operacion' })
                }
            }
        } else {
            res.status(401).json({ error: 'La orden no existe o credenciales incorrectas' });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
};


module.exports = {
    generateJWT,
    validateJWT,
    userActive,
    registerParams,
    signinParams,
    validateRoleAdmin,
    validateRoleUser,
    existsUserId,
    validateUserId,
    productParams,
    existsProductId,
    orderParams,
    statusParam,
    orderRol,
    existsOrderId,
};