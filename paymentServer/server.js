const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('express');
const port = 3002
const stripe = require('stripe')('sk_test_51IU3CaHobA4nRrQlkRBzmdBvH6ITB7l9RIuYea44zXOx2qjQaMK4du46UETaNiOCL9TZrCYogl5UrZHg6aAX7eq300CNCDd6uj');
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

/*
app.post('/pay', async (req, res) => {
    const {email} = req.body;
    console.log(email);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'sgd',
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
    });

    res.json({'client_secret': paymentIntent['client_secret']})
})
*/

app.post('/createPricingPlan', async (req, res) => {
    

    const {personId, price} = req.body;

    if (price == 0) {
        res.json({'stripePrice': {id: null}});
        return
    }
    const product = await stripe.products.create({
        name: `Subscription for user ${personId}`,
      });

    const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: price * 100,
        currency: 'sgd',
        recurring: {
          interval: 'month',
        },
      });

    

    res.json({'stripePrice': stripePrice});
})

app.post('/createCustomer', async (req, res) => {
    console.log('create customer method called')
    const {email, payment_method} = req.body;
    try {
        const customer = await stripe.customers.create({
            payment_method: payment_method,
            email: email,
            invoice_settings: {
                default_payment_method: payment_method,
            },
        });
        res.json({'customerId': customer.id})
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            message: 'This is an error'
         });
    }
})

app.post('/unsub', async (req, res) => {
    console.log('unsubscribe method called');
    const {subId} = req.body;

    stripe.subscriptions.update(subId, {cancel_at_period_end: true});
    res.json({status: 'success'})
})

app.post('/resub', async (req, res) => {
    console.log('resub method called');
    const {subId} = req.body;

    stripe.subscriptions.update(subId, {cancel_at_period_end: false});
    res.json({status: 'success'})
})

app.post('/sub', async (req, res) => {
    console.log('subscribe method called')
    const {customerId, plan} = req.body;
    console.log(customerId);

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{plan: plan}],
        expand: ['latest_invoice.payment_intent']
    });

    const status = subscription['latest_invoice']['payment_intent']['status']
    const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
    res.json({'client_secret': client_secret, 'status': status, 'subId': subscription.id})
})

app.listen(port, () => console.log(`payment server listening on port ${port}`))
