import React, { useState, useEffect } from 'react';
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
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
// Util imports
import { makeStyles } from '@material-ui/core/styles';
// Custom Components
import CardInput from '../components/CardInputs';
import { useAlert } from "react-alert";


const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    marginTop: "25vh",
    marginLeft: "600px",
    borderColor: "purple"
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
    backgroundColor: "#3B21CB",
  },
});

function PaymentPage() {

  const alert = useAlert();
  const history = useHistory();
  const [price, setPrice] = useState(0);
  const [isProcessing, setProcessingTo] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('');
  const [customerId, setCustomerId] = useState();
  const { anotherPersonId } = useParams();
  const currentUser = useSelector((state) => state.currentUser);
  useEffect(() => {
    Api.getPersonById(currentUser)
      .done((data) => {
        setEmail(data.email);
        const { stripeCustomerId } = data
        setCustomerId(stripeCustomerId);
        Api.getPersonById(anotherPersonId).done((data) => {
          // console.log(data);
          setPrice(data.pricingPlan);
          setPlan(data.stripePrice);
        })
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

  function handleSubscribe(subId) {
    Api.subscribeToPerson(currentUser, anotherPersonId, subId)
      .done(() => {
        console.log('subscription done');
        Api.followPerson(currentUser, anotherPersonId)
          .done(() => {
            setProcessingTo(false);
            history.push("/paymentSuccess");
          })
          .fail((xhr, status, error) => {
            if (xhr.responseJSON.error !== 'Follow Entity already exists') {
              setProcessingTo(false);
              alert.show(xhr.responseJSON.error)
            }
          });
        setProcessingTo(false);
        history.push("/paymentSuccess");
      })
      .fail((xhr, status, error) => {
        setProcessingTo(false);
        alert.show(xhr.responseJSON.error);
      });
  }


  const handleSubmitSub = async (event) => {
    setProcessingTo(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }


    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(customerId);
      if (customerId == undefined) {
        try {
          const data = await paymentApi.createCustomer(result, email);
          console.log(data);
          setCustomerId(data.customerId);
          await Api.updateStripeCustomerId(currentUser, data.customerId)
          console.log("customerId persisted");

          paymentApi.subscribe(data.customerId, plan)
            .done((res) => {
              const { client_secret, status, subId } = res;

              if (status === 'requires_action') {
                stripe.confirmCardPayment(client_secret).then(function (result) {
                  if (result.error) {
                    setProcessingTo(false);
                    alert.show('There was an issue! Please try again later');
                    console.log(result.error);
                    // Display error message in your UI.
                    // The card was declined (i.e. insufficient funds, card has expired, etc)
                  } else {
                    handleSubscribe(subId);
                    // Show a success message to your customer
                  }
                });
              } else {
                handleSubscribe(subId);
                // No additional information was needed
                // Show a success message to your customer
              }
            }).fail((res) => {
              setProcessingTo(false);
              alert.show('There was an issue! Please try again later');
              console.log(result.error);
            })
        } catch (e) {
          alert.show(`There was an issue! ${e.responseJSON.message}`);
          setProcessingTo(false);
        }

      } else {

        console.log(customerId);
        paymentApi.subscribe(customerId, plan)
          .done((res) => {
            const { client_secret, status, subId } = res;

            if (status === 'requires_action') {
              stripe.confirmCardPayment(client_secret).then(function (result) {
                if (result.error) {
                  setProcessingTo(false);
                  alert.show('There was an issue! Please try again later');
                  console.log(result.error);
                  // Display error message in your UI.
                  // The card was declined (i.e. insufficient funds, card has expired, etc)
                } else {
                  handleSubscribe(subId);
                  // Show a success message to your customer
                }
              });
            } else {
              handleSubscribe(subId);
              // No additional information was needed
              // Show a success message to your customer
            }
          }).fail((res) => {
            setProcessingTo(false);
            alert.show('There was an issue! Please try again later');
            console.log(result.error);
          })
      }

    }
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <div>
          <p
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "22px",
              paddingTop: "20px",
              paddingBottom: "10px",
            }}
          >
            PAYMENT DETAILS
          </p>
          <p
            style={{
              fontWeight: "400",
              textAlign: "center",
              fontSize: "20px",
              paddingBottom: "20px",
            }}
          >
            TOTAL: ${price} / month
          </p>
        </div>

        <CardInput />
        <div className={classes.div}>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSub} disabled={isProcessing || !stripe} style={{ width: "150px", fontWeight: "bold" }}>
            {isProcessing ? "Processing..." : `Subscribe`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentPage;