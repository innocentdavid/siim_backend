const express = require('express')
const stripe = require('stripe')('sk_test_51LpIDZEnD23RzUmzduhW450yemj8EGA1Al9P7CH4p24FzTZXl2xeUbzXwEV75Cwbn0WNdeG1xQOGChQOhjw1pt3M00LhI4l1tz');
// CORS is enabled only for demo. Please dont use this in production unless you know about CORS
const cors = require('cors');
// import cors from 'cors'
// const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 8000
const app = express()

app.use(express.urlencoded())
app.use('/webhook', express.raw({type: "*/*"}));
app.use(express.json());
// app.use(cors(corsOptions))
app.use(cors())



const endpointSecret = "whsec_m0H5F1EJlHhJzZcjSxImOcLOkPc7VMnT";

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  console.log(request.body);
  console.log('///////////////////////////////////////////////////////////////');
  console.log('///////////////////////////////////////////////////////////////');
  console.log('///////////////////////////////////////////////////////////////');
  console.log('///////////////////////////////////////////////////////////////');
  console.log('///////////////////////////////////////////////////////////////');
  console.log(request.rawBody);
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      console.log(customerSubscriptionCreated)
      break;
    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      // Then define and call a function to handle the event customer.subscription.deleted
      console.log(customerSubscriptionDeleted)
      break;
      case 'customer.subscription.updated':
        const customerSubscriptionUpdated = event.data.object;
        // Then define and call a function to handle the event customer.subscription.updated
        console.log(customerSubscriptionUpdated);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(8000, () => console.log('Example app listening on port 8000!'))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
