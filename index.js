const express = require('express')
const chargebee = require("chargebee")
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
// const { unbilled_charge } = require('chargebee/lib/resources/api_endpoints');
const PORT = process.env.PORT || 8000

chargebee.configure({
  site: "sproutysocial",
  // api_key: "live_JtEKTrE7pAsvrOJar1Oc8zhdk5IbvWzE"
  api_key: "live_BW3FVqcdbW4naokDniIcdajdNBWm3MJc1v"
});
const app = express()

app.use(express.urlencoded())
// app.use(cors(corsOptions))
app.use(cors())

// function addDays(days) {
//   var result = new Date();
//   result.setDate(result.getDate() + days);
//   return result;
// }

app.post("/api/generate_checkout_new_url", (req, res) => {
  chargebee.hosted_page.checkout_new_for_items({
    subscription_items:
    [{
      item_price_id: req?.body?.plan_id,
      item_price_price: '9995',
      currency_code: 'USD',
      quantity: 1,
    }]
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
      // res.send(error);
    } else {
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/cancel_for_items", (req, res) => {
  chargebee.subscription.cancel_for_items(req.body.subscription_item_id, {
    end_of_term: false
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      // console.log(result);
      var subscription = result.subscription;
      var customer = result.customer;
      var card = result.card;
      var invoice = result.invoice;
      var unbilled_charges = result.unbilled_charges;
      var credit_notes = result.credit_notes;
      res.send(card, invoice, credit_notes, subscription, customer, unbilled_charges)
    }
  });
});

app.post("/api/customer_list", (req, res) => {
  chargebee.customer.list({
    limit: 1,
    "email[is]": req.body.email
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      var customer = {};
      for (var i = 0; i < result.list.length; i++) {
        var entry = result.list[i]
        // console.log(entry);
        customer = entry.customer;
        // var card = entry.card;
      }
      // console.log(customer);
      console.log(result);
      // const customer = result.customer
      res.send(customer)
    }
  });
});

app.post("/api/subscription_list", (req, res) => {
  chargebee.subscription.list({
    limit: 1,
    "customer_id[is]": req.body.customer_id,
}).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      var customer_subscription = {};
      // console.log(result?.list?.[0]?.subscription);
      for (var i = 0; i < result.list.length; i++) {
        var entry = result.list[i]
        customer_subscription = entry.subscription;
      }
      // console.log(customer_subscription);
      res.send(customer_subscription)
    }
  });
});

app.post("/api/pre_cancel", (req, res) => {
  chargebee.hosted_page.pre_cancel({
    // pass_thru_content: "{custom :  {discount_percent: 10}}",
    subscription: {
      // id: "__test__KyVnHhSBWmCoF2tJ"
      // id: "__live__B8NglNTUdZxSWoD"
      id: "B8NglNTUdZxSWoD"
    },
    // cancel_url: 'https//sprouty-social.vercel.app'
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
      // res.send(error);
    } else {
      // console.log(result);
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_checkout_existing_url", (req, res) => {
  chargebee.hosted_page.checkout_existing({
    subscription: {
      // id : "1mhuIhIQhDeD9KFIJ"
      id: req.body.page_id
    },
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_update_payment_method_url", (req, res) => {
  chargebee.hosted_page.manage_payment_sources({
    customer: {
      id: req.body.customer_id
    },
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_portal_session", (req, res) => {
  chargebee.portal_session.create({
    customer: {
      id: req.body.customer_id
    },
  }).request(function (error, result) {
    if (error) {
      //handle error
      console.log(error);
    } else {
      res.send(result.portal_session);
    }
  });
});

app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body)
    .request(function (error, result) {
      if (error) {
        res.status(error.http_status_code || 500);
        res.json(error);
      } else {
        res.json(result);
      }
    });
});

app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(8000, () => console.log('Example app listening on port 8000!'))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
