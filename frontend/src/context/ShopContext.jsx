import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    
    // FIX 1: Initialize cartItems as an OBJECT, not an array.
    // This is the most critical fix.
    const [cartItems, setCartItems] = useState({});

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching products.");
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching cart data.");
        }
    }

    // FIX 3: Improved useEffect logic for clarity and reliability.
    useEffect(() => {
        // This effect runs once on component mount to load products and check for a token.
        async function loadData() {
            await getProductsData();
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
            }
        }
        loadData();
    }, []);

    // This effect runs ONLY when the token state changes.
    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]); // Dependency array ensures this runs when token is set/changed.


    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        // No need for structuredClone here, setCartItems handles immutability.
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (!newCart[itemId]) {
                newCart[itemId] = {};
            }
            newCart[itemId][size] = (newCart[itemId][size] || 0) + 1;
            return newCart;
        });

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || "Failed to add to cart.");
            }
        }
    }

    const updateQuantity = async (itemId, size, quantity) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] && newCart[itemId][size] !== undefined) {
                newCart[itemId][size] = quantity;
            }
            return newCart;
        });

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || "Failed to update cart.");
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            // FIX 2: Add a guard clause to prevent errors if a product is not found.
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo) {
                for (const size in cartItems[itemId]) {
                    if (cartItems[itemId][size] > 0) {
                        totalAmount += itemInfo.price * cartItems[itemId][size];
                    }
                }
            }
        }
        return totalAmount;
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    totalCount += cartItems[itemId][size];
                }
            }
        }
        return totalCount;
    }

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems, // Pass this down for PlaceOrder to clear the cart
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;