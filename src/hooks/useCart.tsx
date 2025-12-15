import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        product:products(id, name, price, image_url)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart:", error);
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    // Check if item already exists
    const existingItem = items.find(
      (item) => item.product_id === productId && item.size === size && item.color === color
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      return;
    }

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
      size,
      color,
    });

    if (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
      fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      console.error("Error removing from cart:", error);
    } else {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating quantity:", error);
    } else {
      setItems(items.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
    }
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);

    if (error) {
      console.error("Error clearing cart:", error);
    } else {
      setItems([]);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const checkout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      });
      return;
    }

    const checkoutItems = items.map((item) => ({
      name: item.product?.name || "Product",
      description: `Size: ${item.size || "N/A"}, Color: ${item.color || "N/A"}`,
      price: item.product?.price || 0,
      quantity: item.quantity,
      image: item.product?.image_url,
    }));

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { items: checkoutItems, type: "fashion" },
    });

    if (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }

    if (data?.url) {
      window.open(data.url, "_blank");
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
