const express = require('express')
const chargebee = require("chargebee")
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
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

app.post("/api/generate_checkout_new_url", (req, res) => {
  chargebee.hosted_page.checkout_new({
    subscription : {
      plan_id : req.body.plan_id // plan_id from chargebee
    },
    customer: {
      id: req.body.customer_id
    }
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_checkout_existing_url", (req, res) => {
  chargebee.hosted_page.checkout_existing({
    subscription : {
      // id : "1mhuIhIQhDeD9KFIJ"
      id : req.body.page_id
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});

app.post("/api/generate_update_payment_method_url", (req, res) => {
  chargebee.hosted_page.manage_payment_sources({
    customer : {
      id: req.body.customer_id
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.hosted_page);
    }
  });
});


app.post("/api/generate_portal_session", (req, res) => {
  chargebee.portal_session.create({
    customer : {
      id: req.body.customer_id
    }, 
  }).request(function(error,result){
    if(error){
      //handle error
      console.log(error);
    }else{
      res.send(result.portal_session);
    }
  });
});

app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body)
  .request(function(error,result) {
      if(error){
          res.status(error.http_status_code || 500);
          res.json(error);
      } else{
          res.json(result);
      }
  });
});

app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(8000, () => console.log('Example app listening on port 8000!'))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
