const router = require('express').Router()
const USER = require('../models/USER')
const verify = require('../middlewere/verify.js')


router.use(verify)
//cart create,update,delete operation
router.post('/cart', async (req, res) => {

    try {
        if(!req.body.product){
            return res.send("no items")
        }
        const user = await USER.findOneAndUpdate({ _id: req.data.id }, {
            $push: {
                "cart": req.body
            }
        }, { new: true });
        const { cart } = await user.populate('cart.product', '_id title price category')
        res.send(cart)
    } catch (error) {
        res.status(400).send(error)
    }



});

router.delete('/cart', async (req, res) => {
     const id = req.query.item;
     const empty = req.query.empty;

    try {
        if(empty){

            const user = await USER.findOneAndUpdate({ _id: req.data.id },
            { $set: { "cart": [] } },
            { new: true });
            const { cart } = await user.populate('cart.product', '_id title price')
            return res.json("Cart emptied")
        }
        const user = await USER.findOneAndUpdate({ _id: req.data.id },
            { $pull: { "cart": { '_id': id } } },
            { new: true });

        const { cart } = await user.populate('cart.product', '_id title price')

        return res.json(cart)
    } catch (error) {
        return res.status(400).json(error)
    }
})


router.put('/cart/:id', async (req, res) => {

    const produtctId = req.body.product
    const quantity = req.body.quantity
    if (req.data.id === req.params.id) {
        try {
            const user = await USER.findOneAndUpdate({ _id: req.params.id, 'cart.product': produtctId },
                {
                    $set: {
                        'cart.$.quantity': quantity
                    }
                }, { new: true });

            const { cart } = await user.populate('cart.product', '_id title price category')
            res.send(cart)
        } catch (error) {
            res.send(error)
        }

    }
})
//getting cart items by user ID
router.get('/cart', async (req, res) => {
        try {
            const user = await USER.findById({ _id: req.data.id })
            const { cart } = await user.populate('cart.product', '_id title price category')
            res.json(cart)
        } catch (error) {
            console.log(error)
            res.status(400).send("invalid request")
        }

});



module.exports = router;