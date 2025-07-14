import Title from "../components/Title";
import CardTotal from "../components/CardTotal";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios"; // Make sure axios is imported

export default function PlaceOrder() {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            let orderItems = [];
            // FIX 1: Using "for...of Object.keys()" or "for...in" with "const" is safer
            for (const itemId in cartItems) {
                // FIX 1 (continued): Declared 'size' with 'const'
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        // FIX 3: Find product using '_id', not 'id'
                        const itemInfo = products.find(product => product._id === itemId);
                        if (itemInfo) {
                            // Using structuredClone is great!
                            const orderItem = structuredClone(itemInfo);
                            orderItem.size = size;
                            orderItem.quantity = cartItems[itemId][size];
                            orderItems.push(orderItem);
                        }
                    }
                }
            }
            
            if (orderItems.length === 0) {
                toast.error("Your cart is empty or there was an issue finding product details.");
                return;
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            };
           
            switch(method){

                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  if (response.data.success) {
                    setCartItems({});
                    toast.success("Order Placed Successfully!");
                    navigate('/orders');
                } else {
                    toast.error(response.data.message || "Something went wrong.");
                }
                break;

                default:
                    break;
            }
           
        } catch (error) {
            console.error("Order submission error:", error);
            // Provide feedback to the user on failure
            toast.error(error.response?.data?.message || "An error occurred while placing the order.");
        }
    }

    return (
        // FIX 4: The onSubmit handler belongs on the <form> element
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3" >
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="First name" />
                    <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Last name" />
                </div>
                <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Email address" />
                <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Street" />
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="City" />
                    <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="State" />
                </div>
                <div className="flex gap-3">
                    <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Pincode" />
                    <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Country" />
                </div>
                <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone" />
            </div>
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CardTotal />
                </div>
                <div className="mt-12">
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        {/* FIX 4 (continued): Removed the redundant onSubmit from the button */}
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm cursor-pointer">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}