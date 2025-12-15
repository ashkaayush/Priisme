import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

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

              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              
              <p className="text-muted-foreground mb-8">
                Your appointment has been booked successfully.
                You will receive an email confirmation with all the details.
              </p>

              <div className="p-4 rounded-xl bg-secondary/50 mb-8">
                <p className="text-sm text-muted-foreground">
                  Please arrive 10 minutes before your appointment time.
                  For any changes, please contact the salon directly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/salons" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Another Appointment
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">
                    Go Home
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
