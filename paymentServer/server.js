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
        amount: 1000,
        currency: 'sgd',
        metadata: {integration_check: 'accept_a_payment'},
        recepient_email: email,
    });

    res.json({'client_secret': paymentIntent['client_secret']})
})

app.listen(port, () => console.log(`payment server listening on port ${port}`))
