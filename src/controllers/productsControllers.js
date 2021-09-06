const { db, Sequelize } = require('../../database');

const createProduct = (req, res) => {
    const { productName, productPrice, productDescription } = req.body;

    db.query('INSERT INTO products (productName, productPrice, productDescription) VALUES (?,?,?)', {
            type: Sequelize.QueryTypes.INSERT,
            replacements: [productName, productPrice, productDescription]
        }).then(result => {
            res.status(201).json({ msg: 'Producto creado con exito' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};

const productsList = (req, res) => {
    db.query('SELECT * FROM products', {
        type: Sequelize.QueryTypes.SELECT
    }).then((products) => {
        res.json(products);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' })
    })
}

const productById = (req, res) => {
    const { idProduct } = req.params;

    db.query('SELECT * FROM products WHERE product_id=?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [idProduct]

    }).then((product) => {
        if (product.length != 0) {
            res.status(201).json({ Info: product[0] });
        } else {
            res.status(404).json({ error: 'El producto no existe o credenciales icorrectas ' })
        }
    }).catch(err => {
        res.status(500).json({ error: 'Error en el servidor' })
    });
};

const updateProduct = (req, res) => {
    const { idProduct } = req.params;
    const { productName, productPrice, productDescription } = req.body;

    db.query('UPDATE products SET productName = ? ,productPrice=?, productDescription=? WHERE product_id= ?', {
            type: Sequelize.QueryTypes.UPDATE,
            replacements: [productName, productPrice, productDescription, idProduct]
        }).then(result => {
            res.status(201).json({ msg: 'Producto actualizado exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};

const deleteProductById = (req, res) => {
    const { idProduct } = req.params;
    db.query('DELETE FROM products WHERE product_id = ?', {
            type: Sequelize.QueryTypes.DELETE,
            replacements: [idProduct]
        })
        .then(result => {
            res.status(201).json({ msg: 'Producto eliminado exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};


module.exports = {
    productsList,
    productById,
    updateProduct,
    deleteProductById,
    createProduct
}