import { Cart, Product, Storefront, User, VirtualWallet } from "@/utils/types";
import React, { createContext, ReactNode, useEffect, useState, useContext } from "react";

interface OjaProviderProps{
    children: ReactNode;
}

interface OjaContextType {
    user: User | null;
    stores: Array<Storefront>;
    cart: Cart | null;
    setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
    loading: boolean;
    products: [Product] | [];
}

export const OjaContext = createContext<OjaContextType>({
    user: null,
    stores: [],
    cart: null,
    setCart: () => {},
    loading: false,
    products: []
})

export const OjaProvider: React.FC<OjaProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/auth/users/me`;
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const userData = await response.json(); // Parse the JSON from the response
            setUser(userData.user); // Update the user state with fetched data
        } catch (error: any) {
            setError(error.message); // Update error state if there's an error
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };
    useEffect(() => {
        if(!user){
            fetchUserData();
        }
    }, [user]);

    const [cart, setCart] = useState<Cart | null>(null); 

    const fetchcartData = async () => {
        const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/carts/me`;
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const cartData = await response.json(); // Parse the JSON from the response
            setCart(cartData.cart); // Update the cart state with fetched data
        } catch (error: any) {
            setError(error.message); // Update error state if there's an error
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };
    useEffect(() => {
        if(!cart && user){
            fetchcartData();
        }
    }, [cart, user]);

    const [store, setStore] = useState<Array<Storefront>>([]); 

    const fetchStoreData = async () => {
        const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/storefronts`;
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const storeData = await response.json(); // Parse the JSON from the response
            if(storeData && Array.isArray(storeData.storefronts)){
                setStore(storeData.storefronts); // Update the cart state with fetched data
            }else{
                console.log("store is not array")
            }
        } catch (error: any) {
            setError(error.message); // Update error state if there's an error
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };
    useEffect(() => {
        if(store.length < 1){
            fetchStoreData();
        }
    }, [store]);

    return(
        <OjaContext.Provider value={{ user: user, stores: store, cart: cart, setCart: setCart, loading: loading, products: [] }}>
            {children}
        </OjaContext.Provider>
    )
    
}
export const useOjaContext = () => {
  const context = useContext(OjaContext);
  if (context === undefined) {
    throw new Error("useOjaContext must be used within an OjaProvider");
  }
  return context;
};