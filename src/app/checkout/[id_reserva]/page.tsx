import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import ResumenAlquiler from "@/components/checkout/ResumenAlquiler";
import ConfirmarPagoForm from "@/components/checkout/ConfirmarPagoForm";

export default function CheckoutPage() {
  return (
    <main className="checkout-layout">

      <Header />

      <div className="checkout-container">
        <div className="checkout-grid">
          <ConfirmarPagoForm />
          <ResumenAlquiler />
        </div>
      </div>

      <Footer />

    </main>
  );
}