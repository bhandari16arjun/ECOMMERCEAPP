import orderModel from "../models/orderModel.js"; // FIX: Added .js extension
import userModel from "../models/userModel.js";  // FIX: Added .js extension
import Stripe from "stripe";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: "COD",
            date: Date.now()
            // 'payment' and 'status' will use the default values from the schema
        });
        await newOrder.save();

        // This line was failing because userModel was not imported correctly.
        // It clears the user's cart after the order is placed.
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log("Place Order Error:", error);
        res.status(500).json({ success: false, message: "Error placing order. Please try again." });
    }
}



const placeOrderStripe=async(req,res)=>{

}

const placeOrderRazorpay=async(req,res)=>{

}

const allOrders=async(req,res)=>{
    
    try{

        const orders=await orderModel.find({});
        res.json({success:true,data:orders});

    } catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

const userOrders = async (req, res) => {
    try {
        // The authUser middleware gives us the userId in the request body.
        // We need to find all orders that match this userId.
        const orders = await orderModel.find({ userId: req.body.userId });

        // Send the found orders back to the frontend.
        res.json({ success: true, data: orders });

    } catch (error) {
        console.log("User Orders Error:", error);
        res.json({ success: false, message: "Error fetching user orders." });
    }
}

const updateStatus=async(req,res)=>{
      try{

        const {orderId,status}=req.body

        await orderModel.findByIdAndUpdate(orderId,{status})

        res.json({success:true,message:'Status Updated'});

      } catch(error){
           console.log(error);
           res.json({success:false,message:error.message});
      }
}

export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus};