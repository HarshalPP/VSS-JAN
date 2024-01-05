const OrderDetails = require('../models/sales');
const eventEmitter = require('../utils/eventEmitter');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fcm.json');
const salesorder = require('../models/sales'); // Assuming salesorder is the correct model
const stocks=require('../models/Stock_M')


// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendPushNotification(deviceToken, message) {
  const payload = {
    notification: {
      title: 'Order Accepted',
      body: message,
    },
  };

  try {
    // Send FCM notification
    const response = await admin.messaging().sendToDevice(deviceToken, payload);
    // Log success or error
    if (response.results && response.results.length > 0) {
      const firstResult = response.results[0];
      if (firstResult.error) {
        console.error('FCM notification failed:', firstResult.error);
      } else {
        console.log('FCM notification sent successfully:', response);
      }
    }
  } catch (error) {
    console.error('Error sending FCM notification:', error);
  }
}

// Listen for 'OrderAccepted' event
// Listen for 'OrderAccepted' event
eventEmitter.on('OrderAccepted', async ({ orderId, sales_id }) => {
    try {
      const salesPerson = await salesorder.findOne({ sales_id });
  
      if (!salesPerson) {
        console.error('Sales person not found for sales_id:', sales_id);
        return;
      }
  
      const { sales_name } = salesPerson;
      const staticDeviceToken = 'your_static_device_token'; // Replace with your static device token
  
      console.log(`New Order has Accpected by Production-head`);
  
      // Additional logic related to notifying the production head manager can be added here
  
      // Send FCM notification to the static device token
      const message = `New Order has Accpected by Production-head ${sales_name}`;
      await sendPushNotification(staticDeviceToken, message);
    } catch (error) {
      console.error('Error handling OrderAccepted event:', error);
    }
  });
  




exports.showOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = await OrderDetails.find({}).populate({
      path: 'productionincharge',
      select: '_id UserName' // Specify the fields you want to include from the 'productionincharge' collection
  })

    // Filter orders with 'Accepted' status
    const acceptedOrders = newOrderDetails.filter(order => order.orderstatus === 'Accepted');
    console.log("This order is accepted",acceptedOrders)

    res.status(200).json({
      orderDetails: acceptedOrders,
    });
  } catch (error) {
    console.error('Error in showOrderDetails:', error);
    res.status(500).json({
      error: error.message,
    });
  }
};


// exports.getStocks=async(req,res)=>{
//   try{

//     const GetAllStocks= await stocks.find({}).exec()
//     if(GetAllStocks){
//       res.status(200).json({
//         stocks:GetAllStocks
//       })
//     }
//   }
//   catch(error){
//     res.status(500).json({
//       Error:error
//     })

//   }
// }

exports.getStocks = async (req, res) => {
  try {
    const Products = await OrderDetails.aggregate([
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: '$products.select_product',
          production_incharge: { $first: '$products.production_incharge' },
        },
      },
      {
        $project: {
          _id: 0,
          select_product: '$_id',
          production_incharge: 1,
        },
      },
    ]).exec();

    console.log(Products);

    if (Products.length === 0) {
      return res.status(404).json({
        message: 'No products found in OrderDetails',
      });
    }

    // Extract an array of values from the objects in Products
    const productValues = Products.map((product) => product.select_product);

    const matchingStocks = await stocks.find({
      product: {
        $in: productValues,
      },
    }).populate('production_incharge').exec();

    console.log("matchingStocks", matchingStocks);

    if (matchingStocks.length > 0) {
      res.status(200).json({
        stocks: matchingStocks,
        production_incharge: Products.map((product) => ({
          select_product: product.select_product,
          production_incharge: product.production_incharge,
        })),
      });
    } else {
      res.status(404).json({
        message: 'No matching Stocks found.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


