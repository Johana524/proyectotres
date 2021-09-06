const { db, Sequelize } = require('../../database');
const { generateJWT } = require('../middlewares/middlewares');

const register = (req, res) => {
    const { userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin } = req.body;

    db.query('INSERT INTO accounts (userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin) VALUES (?,?,?,?,?,?)', {
            type: Sequelize.QueryTypes.INSERT,
            replacements: [userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin]

        }).then(result => {
            res.status(201).json({ msg: 'Usuario creado con exito' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
}

const signIn = (req, res) => {
    const { userEmail, userPassword } = req.body;

    db.query('SELECT * FROM accounts WHERE userEmail=? AND userPassword=?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [userEmail, userPassword]

    }).then((user) => {

        if (user.length != 0) {
            // actualizo userActive
            db.query('UPDATE accounts SET userActive = 1 WHERE accounts.user_id = ?', {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [user[0].user_id]

            }).then((result) => {
                let usuario = user[0];
                const token = generateJWT({ user_id: usuario.user_id, userAdmin: usuario.userAdmin });
                res.json({
                    token: token,
                    usuario: {
                        user_id: usuario.user_id,
                        userEmail: usuario.userEmail,
                        userPassword: usuario.userPassword,
                        userPhone: usuario.userPhone,
                        userAddress: usuario.userAddress,
                        userActive: usuario.userActive,
                        userAdmin: usuario.userAdmin
                    }
                });
            });
        } else {
            res.status(404).json({ error: 'El usuario no existe o credenciales icorrectas' })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    });
};

const updateUser = (req, res) => {
    const { idUser } = req.params;
    const { userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin } = req.body;

    db.query('UPDATE accounts SET userCompleteName = ? ,userEmail=?, userPassword=?,userPhone=?, userAddress=?, userAdmin=? WHERE user_id= ?', {
            type: Sequelize.QueryTypes.UPDATE,
            replacements: [userCompleteName, userEmail, userPassword, userPhone, userAddress, userAdmin, idUser]
        }).then(result => {
            res.status(201).json({ msg: 'Usuario actualizado exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
}

const userById = (req, res) => {
    const { idUser } = req.params;
    db.query('SELECT * FROM accounts WHERE user_id=?', {
        type: Sequelize.QueryTypes.SELECT,
        replacements: [idUser]

    }).then((user) => {
        if (user.length != 0) {
            res.status(200).json({
                Info: user[0]
            });
        } else {
            res.status(404).json({ error: 'El usuario no existe o credenciales icorrectas' })
        }
    }).catch(err => {
        res.status(500).json({ error: 'Error en el servidor' })
    });
};

const accounts = (req, res) => {
    db.query('SELECT * FROM accounts', {
        type: Sequelize.QueryTypes.SELECT
    }).then((accounts) => {
        res.json(accounts);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' })
    })
};

const deleteUserById = (req, res) => {
    const userId = req.params.idUser;
    db.query('DELETE FROM accounts WHERE user_id = ?', {
            type: Sequelize.QueryTypes.DELETE,
            replacements: [userId]
        })
        .then(result => {
            res.status(201).json({ msg: 'Usuario eliminado exitosamente' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error en el servidor' });
        });
};

// const logout = (req, res) => {
//     const { idUser } = req.params;
//     console.log(req.body)

//     db.query('UPDATE accounts SET userActive = 0 WHERE user_id = ?', {
//         type: Sequelize.QueryTypes.UPDATE,
//         replacements: [idUser]
//     }).then((result) => {
//         res.json({ msg: 'User logout' });

//     }).catch(err => {
//         console.log(err);
//         res.status(500).json({ error: 'Error en el servidor' });
//     });
// }


module.exports = { accounts, register, signIn, userById, deleteUserById, updateUser };