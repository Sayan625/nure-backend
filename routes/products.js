const router = require('express').Router();
const PRODUCT = require('../models/PRODUCT');
const verify = require('../middlewere/verify');

// Endpoint to add a new product as an admin
router.post('/new', verify, async (req, res) => {
    const isAdmin = req.query.admin;
    // Check if the request is from an admin user
    if (!isAdmin)
        return res.status(400).send("Not admin");

    try {
        // Create a new product using the data in the request body
        const newProduct = new PRODUCT(req.body);
        // Save the new product to the database
        const savedProduct = await newProduct.save();
        // Populate the category field and send the saved product as a response
        await savedProduct.populate('category', "_id name");
        return res.json(savedProduct);
    } catch (error) {
        return res.send(error);
    }
});

// Endpoint to update a product
router.put('/update/:id', verify, async (req, res) => {
    const isAdmin = req.query.admin;
    // Check if the request is from an admin user
    if (!isAdmin)
        return res.status(400).send("Not admin");

    try {
        const id = req.params.id;
        const updateData = req.body;

        // Find and update the product by ID, and return the updated product
        const updatedProduct = await PRODUCT.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});

// Endpoint to delete a product
router.delete('/remove/:id', verify, async (req, res) => {
    const id = req.params.id;
    try {
        // Find and delete a product by ID
        await PRODUCT.findByIdAndDelete(id);
        res.status(200).send("Product deleted");
    } catch (error) {
        res.status(400).send("Deletion failed");
    }
});

// Endpoint to get products by category
router.get('/category/:id', async (req, res) => {
    const query = req.params.id;
    try {
        // Find products with a specific category ID, sort by creation date, and populate the category field
        const products = await PRODUCT.find({ 'category': query }).sort({ 'createdAt': -1 }).populate('category', "_id name").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json("Not found");
    }
});

// Endpoint to get products by type
router.get('/type/:type', async (req, res) => {
    const query = req.params.type;
    try {
        // Find products with a specific type, sort by creation date, and populate the category field
        const products = await PRODUCT.find({ 'type': query }).sort({ 'createdAt': -1 }).populate('category', "_id name").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json("Not found");
    }
});

// Endpoint to get products sorted by creation date or price
router.get('/date', async (req, res) => {
    const query = req.query.order;
    try {
        // Find all products, sort them by creation date or price, and populate the category field
        const products = await PRODUCT.find().sort({ 'createdAt': query }).populate('category', "_id name").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json("Not found");
    }
});

// Endpoint to get products sorted by price
router.get('/price', async (req, res) => {
    const query = req.params.order;
    try {
        // Find all products, sort them by price, and populate the category field
        const products = await PRODUCT.find().sort({ 'price': query }).populate('category', "_id name").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json("Not found");
    }
});

// Endpoint to get all products
router.get('/', async (req, res) => {
    try {
        // Find all products, sort them by creation date, and populate the category field
        const products = await PRODUCT.find().sort({ 'createdAt': -1 }).populate('category', "_id name").exec();
        res.json(products);
    } catch (error) {
        res.status(400).json("Not found");
    }
});

// Endpoint to get a product by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Find a product by ID and populate the category field, then return the product
        const product = await PRODUCT.findById(id).populate('category', "_id name").exec();
        return res.json(product);
    } catch (error) {
        console.log(error);
        return res.status(400).json("Not found");
    }
});

// Endpoint to update a product's rating
router.put('/rating/:id', verify, async (req, res) => {
    try {
        const userId = req.data.id;
        const id = req.params.id;
        const data = {
            _id: userId,
            value: req.body.rating
        }
        const product = await PRODUCT.findById(id);
        if (!product)
            return res.status(400).json("Product not found");
        let index = -1;
        for (let i = 0; i < product.rating.length; i++) {
            if (product.rating[i]._id?.toString() === userId) {
                index = i;
                break;
            }
        }
        console.log(index);
        if (product.rating.length === 0 || index < 0) {
            product.rating.push(data);
            await product.save();
            return res.status(200).json(product);
        }
        if (index >= 0) {
            product.rating[index].value = req.body.rating;
            await product.save();
            return res.status(200).json(product);
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

module.exports = router;
