import { createContext, useContext, useState } from "react";
import { getAllCart } from "../../util/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await getAllCart();
            if (res.EC === 0) {
                setCartItems(res.DT || []);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Lỗi khi fetch cart:", error);
            setCartItems([]);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    const clearCart = () => context.setCartItems([]);
    return { ...context, clearCart };
};
