const express = require('express')
const axios = require('axios')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('express');
const port = 3002
const stripe = require('stripe')('sk_test_51IU3CaHobA4nRrQlkRBzmdBvH6ITB7l9RIuYea44zXOx2qjQaMK4du46UETaNiOCL9TZrCYogl5UrZHg6aAX7eq300CNCDd6uj');
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

const BACKEND_SERVER_PREFIX = "http://localhost:8080/penmeetspaper-war/webresources";

const getSubscribers = async function (id) {
    return await axios.get(BACKEND_SERVER_PREFIX + "/person/" + id + "/subscribers/");
};

const unsubscribeFromPerson = async function (subscriberId, publisherId) {
    return await axios.delete(BACKEND_SERVER_PREFIX + "/subscription/subscriber/" + subscriberId + "/publisher/" + publisherId)
};

const getPersonById = async function (id) {
    return await axios.get(BACKEND_SERVER_PREFIX + "/person/" + id);
}

app.post('/createProductForUser', async (req, res) => {
    console.log("CreateProductForUser Called")
    const { personId } = req.body;
    try {
        const product = await stripe.products.create({
            name: `Subscription for user ${personId}`,
        });

        console.log("CreateProductForUser Success");
        res.json({ 'productId': product.id });
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            message: 'Error occured creating Product for User'
        });
    }
});

app.post('/createPricingPlan', async (req, res) => {

    console.log("createPricingPlan called");
    const { personId, price, oldPrice, productId } = req.body;

    if (oldPrice != price) {
        const result = await getSubscribers(personId);
        const subscriptionArr = result.data;

        if (price > oldPrice) {
            for (const element of subscriptionArr) {
                const { stripeSubId, subscriber, isTerminated } = element;
                if (!isTerminated) {
                    if (stripeSubId != undefined) {
                        stripe.subscriptions.update(stripeSubId, { cancel_at_period_end: true });
                    }
                    unsubscribeFromPerson(subscriber.id, personId);
                }
            };

            const stripePrice = await stripe.prices.create({
                product: productId,
                unit_amount: price * 100,
                currency: 'sgd',
                recurring: {
                    interval: 'month',
                },
            });
            res.json({ 'stripePrice': stripePrice });
            return;

        } else {
            if (price == 0) {
                // if price is 0, terminate subscriptions
                for (const element of subscriptionArr) {
                    const { stripeSubId, subscriber, isTerminated } = element;
                    if (!isTerminated) {
                        if (stripeSubId != undefined) {
                            stripe.subscriptions.update(stripeSubId, { cancel_at_period_end: true });
                        }
                        unsubscribeFromPerson(subscriber.id, personId);
                    }
                };
            } else {
                // price is lower than oldPrice, downgrade
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
                for (const element of subscriptionArr) {
                    const { stripeSubId, subscriber, isTerminated } = element;
                    if (!isTerminated) {
                        if (stripeSubId != undefined) {
                            try {
                                const subscription = await stripe.subscriptions.retrieve(stripeSubId);
                                await stripe.subscriptions.update(stripeSubId, {
                                    cancel_at_period_end: false,
                                    proration_behavior: 'create_prorations',
                                    items: [{
                                        id: subscription.items.data[0].id,
                                        price: stripePrice.id,
                                    }]
                                });
                            } catch (e) {
                                console.log(e);
                            }

                        }

                    }
                };


                res.json({ 'stripePrice': stripePrice });
                return;


            }
        }

    }

    res.json({ 'stripePrice': { id: "notCreated" } });
    return;
});



app.post('/createCustomer', async (req, res) => {
    console.log('create customer method called')
    const { email, payment_method } = req.body;
    try {
        const customer = await stripe.customers.create({
            payment_method: payment_method,
            email: email,
            invoice_settings: {
                default_payment_method: payment_method,
            },
        });
        res.json({ 'customerId': customer.id })
    } catch (e) {
        console.log("error occured");
        return res.status(400).send({
            message: e.decline_code
        });
    }
})

app.post('/unsub', async (req, res) => {
    console.log('unsubscribe method called');
    const { subId } = req.body;

    stripe.subscriptions.update(subId, { cancel_at_period_end: true });
    res.json({ status: 'success' })
})

app.post('/resub', async (req, res) => {
    console.log('resub method called');
    const { subId, personId } = req.body;

    const subscription = await stripe.subscriptions.retrieve(subId);
    const subPrice = subscription.plan.id;
    const person = await getPersonById(personId);
    const personPrice = person.data.stripePrice;
    if (personPrice == subPrice) {
        stripe.subscriptions.update(subId, { cancel_at_period_end: false });
    } else {
        const subscription = await stripe.subscriptions.retrieve(subId);
        await stripe.subscriptions.update(subId, {
            cancel_at_period_end: false,
            proration_behavior: 'none',
            items: [{
                id: subscription.items.data[0].id,
                price: personPrice,
            }]
        });
    }
    res.json({ status: 'success' })
})

app.post('/sub', async (req, res) => {
    console.log('subscribe method called')
    const { customerId, plan } = req.body;
    console.log(customerId);

    try {

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ plan: plan }],
            expand: ['latest_invoice.payment_intent']
        });

        const status = subscription['latest_invoice']['payment_intent']['status']
        const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
        res.json({ 'client_secret': client_secret, 'status': status, 'subId': subscription.id })
    } catch (e) {
        return res.status(400).send({
            message: 'payment failed'
        });
    }
})

app.listen(port, () => console.log(`payment server listening on port ${port}`))
