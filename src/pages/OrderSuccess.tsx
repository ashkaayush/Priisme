import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [orderProcessed, setOrderProcessed] = useState(false);

  useEffect(() => {
    if (sessionId && !orderProcessed) {
      // Clear the cart after successful payment
      clearCart();
      setOrderProcessed(true);
    }
  }, [sessionId, clearCart, orderProcessed]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your order has been placed successfully.
                You will receive an email confirmation shortly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/fashion" className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
