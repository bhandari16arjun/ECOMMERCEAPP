import userModel from "../models/userModel.js";

// ADD ITEM TO CART
const addToCart = async (req, res) => {
    try {
        // The userId here is the MongoDB _id from the auth middleware
        const { userId, itemId, size } = req.body;

        // 1. Find the user by their ID to get their document
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 2. Get the cartData object from the user document
        let cartData = userData.cartData;

        // 3. Modify the cartData object logic (this part was correct)
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        // 4. Update the user document in the database with the modified cartData
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.log("Add to Cart Error:", error);
        res.json({ success: false, message: "Error adding item to cart." });
    }
}

// UPDATE CART ITEM QUANTITY
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        let userData = await userModel.findById(userId);
         if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let cartData = userData.cartData;

        // Ensure the item and size exist before updating
        if (cartData[itemId] && cartData[itemId][size] !== undefined) {
             cartData[itemId][size] = quantity;
        } else {
             return res.json({success: false, message: "Item not found in cart."})
        }
        
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log("Update Cart Error:", error);
        res.json({ success: false, message: "Error updating cart." });
    }
}

// GET USER'S CART
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        let userData = await userModel.findById(userId);
         if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let cartData = userData.cartData;

        res.json({ success: true, cartData });

    } catch (error) {
        console.log("Get Cart Error:", error);
        res.json({ success: false, message: "Error fetching cart data." });
    }
}

export { addToCart, updateCart, getUserCart };