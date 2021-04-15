const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3002
const stripe = require('stripe')('sk_test_51IU3CaHobA4nRrQlkRBzmdBvH6ITB7l9RIuYea44zXOx2qjQaMK4du46UETaNiOCL9TZrCYogl5UrZHg6aAX7eq300CNCDd6uj');


app.use(cors())

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())

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

app.post('/sub', async (req, res) => {
    const {email, payment_method} = req.body;
    const customer = await stripe.customers.create({
        payment_method: payment_method,
        email: email,
        invoice_settings: {
            default_payment_method: payment_method,
        },
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{plan: 'price_1IgazIHobA4nRrQlS1apl6Sl'}],
        expand: ['latest_invoice.payment_intent']
    });

    const status = subscription['latest_invoice']['payment_intent']['status']
    const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

    res.json({'client_secret': client_secret, 'status': status})
})

app.listen(port, () => console.log(`payment server listening on port ${port}`))