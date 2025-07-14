import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// UPDATED: The component now receives backendUrl and currency as props
export default function Orders({ token, backendUrl, currency }) {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        if (!token || !backendUrl) { // Added a check for backendUrl
            return;
        }
        try {
            // This now uses the backendUrl passed in as a prop
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching all orders:", error);
            toast.error("Failed to fetch orders.");
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            // This now uses the backendUrl passed in as a prop
            const response = await axios.post(`${backendUrl}/api/order/status`, {
                orderId,
                status: event.target.value
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data.success) {
                toast.success("Order status updated!");
                await fetchAllOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status.");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token, backendUrl]); // Added backendUrl to dependency array

    return (
        <div>
            <h3>Order Page</h3>
            <div>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={order._id}>
                            <img className="w-12" src={assets.parcel_icon} alt="parcel icon" />
                            <div>
                                <div>
                                    {order.items.map((item, index) => (
                                        <p className="py-0.5" key={index}>
                                            {item.name} x {item.quantity} <span> {item.size} </span>
                                            {index === order.items.length - 1 ? "" : " ,"}
                                        </p>
                                    ))}
                                </div>
                                <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
                                <div>
                                    <p>{order.address.street + ","}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p>{order.address.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                                <p className="mt-3">Method: {order.paymentMethod}</p>
                                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            {/* This uses the currency passed in as a prop */}
                            <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="p-2 font-semibold border rounded" name="status">
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                ) : (
                    <p>No orders to display.</p>
                )}
            </div>
        </div>
    );
}