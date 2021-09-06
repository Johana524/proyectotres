const express = require('express');
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const productsRoutes = require('./src/routes/productsRoutes');
const ordersRoutes = require('./src/routes/ordersRoutes');


// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);


app.get('/', (req, res) => {
    res.send('DELILAH RESTO')
});

// Start server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});