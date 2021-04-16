import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Api from "../helpers/Api";
import paymentApi from "../helpers/paymentApi";
// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from '../components/CardInputs';

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: '35vh auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  div: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  button: {
    margin: '2em auto 1em',
  },
});

function PaymentPage() {
  const { anotherPersonId } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  let email = "";
  useEffect(() => {
    Api.getPersonById(currentUser)
      .done((data) => {
        email = data.email

      })
      .fail((xhr, status, error) => {
        alert.show(xhr.responseJSON.error);
      });
  }, []);

  const classes = useStyles();
  // State

  const stripe = useStripe();
  const elements = useElements();

  /*
  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await axios.post('http://localhost:3002/pay', {email: email});

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Money is in the bank!');
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };
  */

  const handleSubmitSub = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const plan = 'price_1IgazIHobA4nRrQlE4MmUxeg'

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {;
      paymentApi.subscribe(result, email, plan)
      .done((res) => {
        const {client_secret, status} = res;
        if (status === 'requires_action') {
          stripe.confirmCardPayment(client_secret).then(function(result) {
            if (result.error) {
              console.log('There was an issue!');
              console.log(result.error);
              // Display error message in your UI.
              // The card was declined (i.e. insufficient funds, card has expired, etc)
            } else {
              console.log('You got the money!');
              // Show a success message to your customer
            }
          });
        } else {
          console.log('You got the money!');
          // No additional information was needed
          // Show a success message to your customer
        }
      }).fail((res) => {
        console.log('There was an issue!');
        console.log(result.error);
      })
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        
        <CardInput />
        <div className={classes.div}>
          {/* 
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitPay}>
            Pay
          </Button>
          */}
          
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSub}>
            Subscribe for $10
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentPage;