var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
const { stringify } = require('querystring');

const PORT = 4000;


app.get('/', (req,res) =>{
    res.send('<h1>Welcome to /</h1>')
    //res.sendFile(path.resolve(__dirname,'html', 'index.html'));
})

var buff = '';
var products = [];
fs.readFile('products.txt',  (err, data) => {
    if (err) throw err;
    buff = JSON.parse(data);
    //добавить в массив объекты

    if (Array.isArray(buff)) {
        products = products.push(buff);  
    } else {
        console.error('Данные в products.txt не являются массивом.');
    }
});

app.get('/products/', (req,res) =>{
    console.log(buff);
    
    res.send(`
        <h1>All products: </h1>
        ${JSON.stringify(buff, null, 1)}
    `);
})

app.get('/name/:nameId/price/:priceId', function(request, response){
    console.log(`price: ${request.params['priceId']}`);
    var name = request.params['nameId'];
    var price = request.params['priceId'];
    
    //поиск по названию в buff и отображение других данных, которые относятся к этому названию
    var product = buff.find(item => item.name == name);

    if (product) {
        if (product.price === price) {
            response.send(`
                <h1>Product Details</h1>
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>CPU:</strong> ${product.CPU}</p>
            `);
        } else {
            response.send('Price does not match the product');
        }
    } else {
        response.send('Product not found');
    }


});

app.listen(PORT, ()=>{
    console.log(`Server has been started on port ${PORT} ...`);
});

///     name/Dell XPS 13/price/$999