const axios = require("axios");
const jQuery = require("jquery");
const SERVER_PREFIX = "http://localhost:3002";

export default {
  SERVER_PREFIX: SERVER_PREFIX,

  subscribe(result, email, plan) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/sub",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        payment_method: result.paymentMethod.id,
        email: email,
        plan: plan,
      }),
    });
  },

  createPricingPlan(personId, price) {
    return jQuery.ajax({ 
      url: this.SERVER_PREFIX + "/createPricingPlan",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        personId: personId,
        price: price,
      }),
    });
  },

}