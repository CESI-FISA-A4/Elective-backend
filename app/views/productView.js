const { Product } = require('../models/Product');
const { faker } = require('@faker-js/faker');


module.exports = {
    getAllProducts: async(req, res) => {
        try {
            const allProducts = await Product.find();
            return res.status(200).json(allProducts);
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductById: async(req, res) => {
        const productId = req.params.id; // Assuming you're passing the product ID through the URL params

        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    generateFakeProducts: async(req, res) => {
        console.log("generateFakeProducts");
        // return res.status(200).json({ "info": "Soon..." });
        let data = await module.exports.generateData();
        console.log(data);

        module.exports.generateData().then(fakeProducts => {
                console.log(fakeProducts);
                Product.insertMany(fakeProducts)
                    .then(() => {
                        return res.status(200).json({ "success": "Fake data created sucessfully!" });
                    })
                    .catch(err => res.status(500).json({ "response": "Error during data saving!", "error": err }));
            })
            .catch(err => res.status(200).json({ "response": "Error during fake data creation!", "error": err }));
    },

    generateData: async() => {
        const types = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

        return new Promise((res, rej) => {
            const fakeProducts = [];
            for (let i = 0; i < 100; i++) {
                const fakeProduct = {
                    label: faker.commerce.productName(),
                    price: faker.datatype.number({ min: 1, max: 1000, precision: 0.01 }),
                    quantity: faker.datatype.number({ min: 1, max: 100 }),
                    type: types[Math.floor(Math.random() * types.length)],
                    refundable: faker.datatype.boolean()
                };
                fakeProducts.push(fakeProduct);
            }

            res(fakeProducts);
        });
    }
}