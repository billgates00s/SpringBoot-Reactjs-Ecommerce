import axios from "../axios";
import {useState, useEffect, createContext} from "react";
import {toast} from "react-toastify";

const AppContext = createContext({
    data: [],
    isError: "",
    cart: [],
    addToCart: (product) => {
    },
    removeFromCart: (productId) => {
    },
    refreshData: () => {
    },
    updateStockQuantity: (productId, newQuantity) => {
    }

});

export const AppProvider = ({children}) => {
    const [data, setData] = useState([]);
    const [isError, setIsError] = useState("");
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);


    const addToCart = (product) => {
        if (!product.productAvailable) {
            // ⚠️ Hiển thị thông báo hết hàng
            toast.warning(`"${product.name}" is out of stock!`);
            return;
        }
        const existingProductIndex = cart.findIndex((item) => item.id === product.id);
        if (existingProductIndex !== -1) {
            const updatedCart = cart.map((item, index) =>
                index === existingProductIndex
                    ? {...item, quantity: item.quantity + 1}
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            const updatedCart = [...cart, {...product, quantity: 1}];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        // ✅ Thông báo thêm thành công
        toast.success(`${product.name} added to cart!`);

    };

    const removeFromCart = (productId) => {
        console.log("productID", productId)
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log("CART", cart)
    };

    const refreshData = async () => {
        try {
            const response = await axios.get("/products");
            setData(response.data);
        } catch (error) {
            setIsError(error.message);
        }
    };

    const clearCart = () => {
        setCart([]);
    }

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <AppContext.Provider value={{data, isError, cart, addToCart, removeFromCart, refreshData, clearCart}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;