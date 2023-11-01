const router = require('express').Router()
const ORDER = require('../models/ORDER')
const verify = require('../middlewere/verify.js')

//placing new order
router.post('/', verify, async (req, res) => {
 
    try {
        const newOrder = new ORDER(req.body)
        console.log(req.body)
        newOrder.userId = req.data.id;
        const savedOrder = await newOrder.save();
        res.send(savedOrder);
    } catch (error) {
        console.log(error)
        res.status(400).send("order failed:"+ error.message)
    }

});

//getting all order by all users for admin only not implemented
router.get('/admin', async (req, res) => {
    try {
        const orders = await ORDER.find()
        res.send(orders);
    } catch (error) {
        res.send(error)
    }

});

//getting order history for a user
router.get('/', verify, async (req, res) => {

    if (req.data.id) {
        try {
            const savedOrder = await ORDER.find({ userId: req.data.id }).sort({ createdAt: -1 }).populate('products.product', '_id title price').exec();
            res.send(savedOrder);
        } catch (error) {
            console.log(error)
            res.send("not found");
        }
    } else {
        res.send("Invalid request")
    }
});

//getting order by ID for a specific user 
router.get('/:id', verify, async (req, res) => {

    if (req.data.id) {
        try {
            const savedOrder = await ORDER.findById(req.params.id).populate('products.product', '_id title price').exec();
            res.send(savedOrder);
        } catch (error) {
            res.send("not found");
        }
    } else {
        res.send("Invalid request")
    }
});

//delete order by ID admin only not implemented
router.delete('/:id', verify, async (req, res) => {
    const id = req.params.id
    try {
        await ORDER.findByIdAndDelete(id);
        res.send("order deleted");
    } catch (error) {
        res.send("order failed")
    }

});





module.exports = router;