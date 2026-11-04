// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('miniShopCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      return [];
    }
  });

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('miniShopCart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart or increase its quantity if already present
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   */
  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    const availableStock = product.stock !== undefined ? product.stock : 999;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item._id) === String(product._id)
      );

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQty = Math.min(existingItem.quantity + qty, availableStock);

        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        return updatedItems;
      } else {
        const initialQty = Math.min(qty, availableStock);
        return [
          ...prevItems,
          {
            _id: product._id,
            product: product._id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            stock: availableStock,
            quantity: initialQty,
          },
        ];
      }
    });
  };

  /**
   * Update quantity of a specific cart item
   * @param {string} productId - ID of product
   * @param {number} newQuantity - Target quantity
   */
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity);

    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item._id) === String(productId)) {
          const clampedQty = Math.min(qty, item.stock || 999);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  /**
   * Remove item from cart
   * @param {string} productId - ID of product to remove
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item._id) !== String(productId))
    );
  };

  /**
   * Clear all items from cart (e.g. after successful checkout)
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('miniShopCart');
  };

  // Live total quantity of items in cart
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Grand total price of cart items
  const totalPrice = Number(
    cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
