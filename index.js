var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
const { stringify } = require('querystring');
const PORT = 4000;

var path = 'logger.txt';

app.get('/', (req,res) =>{
    res.send('<h1>Welcome to /</h1>')
})

var buff = '';
var products = [];

fs.readFile('products.txt',  (err, data) => {
    if (err) throw err;
    buff = JSON.parse(data);

    if (Array.isArray(buff)) {
        products = products.concat(buff);  
    } else {
        console.error('Данные в products.txt не являются массивом.');
    }
});

var categotyBuff = '';
var categories = [];

fs.readFile('categories.txt', (err, data) =>{

    if(err){ throw err}

    categotyBuff = JSON.parse(data);

    if(Array.isArray(categotyBuff)){
        categories = categories.concat(categotyBuff);
    }else {
        console.error('Данные в categories.txt не являются массивом.');
    }
})

app.use(function(request, response, next){
    var data = `Time: ${new Date().toLocaleString()}\n`;

    fs.appendFile(path, data, function(err){
        console.log('data wrote');
    });

    next();
});

app.get('/products/', (req, res) => {
    
    var allProducts = `
        <h1>All products: </h1>
        ${products.map(product => `
            <li>
                <strong>Model:</strong> ${product.name}
                <strong>Price:</strong> ${product.price}
                <strong>CPU:</strong> ${product.CPU}<br><br>
            </li>
            
        `).join('')}
    
    
    `;
    res.send(allProducts);
    res.end();
});


app.get('/category/', (req, res) => {
    
    var allCategories = `
        <h1>All products: </h1>
        ${categories.map(category => `
            <div>
                <strong>${category.id} - Category:</strong> ${category.name}<br><br>
                <strong>Products:</strong> 
                ${category.products.map(product =>`
                <li>
                    <strong>${product.name}</strong>
                    $${product.price}
                    ${product.brand || product.author}
                </li>
                `).join('')}
                <br><br>
            </div>
            
        `).join('')}
    `;
    res.send(allCategories);
    res.end();
});

app.get('/category/:categoryId', (req, res) => {

    var ID = req.params[`categoryId`];
    var category = [];
    var Reqcategory = categories.find(item => item.id == ID);
    if(Reqcategory){
        category = category.concat(Reqcategory);
        var findCategory = `
            ${category.map(category => `
                
                 <strong>${category.id} - ${category.name}</strong><br><br>
            Products:
                ${category.products.map( product => `
                    <li>
                        <strong>${product.name}</strong>
                        $${product.price}
                        ${product.brand || product.author}
                        <br><br>
                    </li>

                `).join('')}
            `)}
            
        `;
        res.send(findCategory);
    }else{
        res.send(`Incorrect category!`);
    }
    res.end();

});


app.get('/products/:productId', (req, res) => {
    var name = req.params[`productId`];
    var productsById = [];


    var filteredProducts = products.filter(item => item.name == name);
    if(filteredProducts.length > 0){
        productsById = productsById.concat(filteredProducts);

        var allProducts = `
            <h1>All products with name ${name}: </h1>
            ${productsById.map(product => `

                <li>
                    <strong>Model:</strong> ${product.name}
                    <strong>Price:</strong> ${product.price}
                    <strong>CPU:</strong> ${product.CPU}<br><br>
                </li>
                
            `).join('')}
        `;

        res.send(allProducts);
    }
    else{
        res.send(`We do not have <strong>${name}</strong> in our products!`);
    }
    
    res.end();
});

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
