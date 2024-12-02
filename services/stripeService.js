const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const listAllCustomers = async () => {
  try {
    // Initialize an empty array to store the customer data with payment intent details
    const customersWithPaymentIntents = [];
    
    // Fetch a list of customers from Stripe
    const customers = await stripe.customers.list({
      limit: 15, // Fetch up to 15 customers, adjust the limit as needed
    });

    // Iterate over each customer to fetch their associated payment intents
    for (const customer of customers.data) {
      // Fetch payment intents associated with the current customer
      const paymentIntents = await stripe.paymentIntents.list({
        customer: customer.id,
        limit: 5, // Limit the number of payment intents to 5 per customer (adjustable)
      });

      // Iterate over each payment intent and gather the details
      for (const paymentIntent of paymentIntents.data) {
        const paymentIntentId = paymentIntent.id;
        const paymentIntentDetails = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        // Variables to hold product title and price
        let productTitle = '';
        let price = null;

        // Check if the payment intent is linked to an invoice
        if (paymentIntentDetails.invoice) {
          // Retrieve the invoice associated with the payment intent
          const invoice = await stripe.invoices.retrieve(paymentIntentDetails.invoice);
          
          // Fetch line items of the invoice to get pricing details
          const lineItems = await stripe.invoices.listLineItems(invoice.id);

          // Iterate over line items to fetch price and product information
          for (const item of lineItems.data) {
            const priceId = item.price.id;

            // Fetch the price details for the line item
            const priceData = await stripe.prices.retrieve(priceId);
            price = priceData.unit_amount; // Get the unit price for the item

            // Retrieve the product details using the product ID from the price object
            const product = await stripe.products.retrieve(priceData.product);
            productTitle = product.name; // Get the product title
          }
        } else {
          console.log('No invoice found for payment intent:', paymentIntentId);
        }

        // Add the customer and payment intent details to the customersWithPaymentIntents array
        customersWithPaymentIntents.push({
          customer,
          paymentIntent: paymentIntentDetails,
          title: productTitle,
          price: price,
        });
      }
    }

    // Flatten the data to a list of payment intent details with customer info
    const objects = customersWithPaymentIntents.flatMap(({ customer, paymentIntent, title, price }) => {
      return [{
        stripeId: paymentIntent.id,  // Payment intent ID
        customerEmail: customer.email || 'N/A', // Default to 'N/A' if email is not available
        customerAddress: customer.address || 'N/A', // Ensure the customer object has the address field
        customerCountry: (customer.address && customer.address.country) ? customer.address.country : 'N/A',
        customerName: customer.name,
        customerPhone: customer.phone || 'N/A', // Default to 'N/A' if phone number is not available
        paidAmount: paymentIntent.amount_received || 'N/A', // Include the amount received (paid amount)
        price: price || 'N/A',  // Price of the product, default to 'N/A' if not available
        title: title || 'N/A',  // Product title, default to 'N/A' if not available
      }];
    });

    // Log the objects array to verify the final result
    console.log('objects::', objects);

    // Return the structured data
    return objects;

  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error fetching customers from Stripe: ${error.message}`);
  }
};

module.exports = { listAllCustomers };
