const jQuery = require("jquery");
const SERVER_PREFIX = "http://localhost:3002";

export default {
  SERVER_PREFIX: SERVER_PREFIX,

  subscribe(customerId, plan) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/sub",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        customerId: customerId,
        plan: plan,
      }),
    });
  },

  createPricingPlan(personId, price, oldPrice, productId) {
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
        oldPrice: oldPrice,
        productId, productId,
      }),
    });
  },

  createProductForUser(personId) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/createProductForUser",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        personId: personId,
      }),
    });
  },

  createCustomer(result, email) {
    return jQuery.ajax({
      url: this.SERVER_PREFIX + "/createCustomer",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify({
        payment_method: result.paymentMethod.id,
        email: email,
      }),
    });
  },

  unsub(subId) {
    if (subId !== undefined) {
      return jQuery.ajax({
        url: this.SERVER_PREFIX + "/unsub",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        type: "POST",
        data: JSON.stringify({
          subId: subId,
        }),
      });
    }

  },

  resub(subId, personId) {
    if (subId !== undefined) {
      return jQuery.ajax({
        url: this.SERVER_PREFIX + "/resub",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        type: "POST",
        data: JSON.stringify({
          subId: subId,
          personId: personId,
        }),
      });
    }

  }

}