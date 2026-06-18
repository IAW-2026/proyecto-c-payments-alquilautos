import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-black">
      <Header />
      
      <main className="flex flex-col items-center justify-center py-24 px-8 text-center gap-16 bg-[radial-gradient(circle_at_top_right,#1a1c23,transparent),#000] text-white w-full max-w-full max-lg:py-16 max-lg:px-8 max-lg:gap-12 max-md:py-14 max-md:px-6 max-md:gap-10 max-sm:py-10 max-sm:px-5 max-sm:gap-8">
        <div className="max-w-[800px] flex flex-col gap-6 animate-fade-up max-sm:gap-4">
          <h1 className="font-display text-[2rem] font-bold leading-none text-white tracking-tight sm:text-[3rem] md:text-[3.5rem] lg:text-[5rem]">
            PaymentsApp
          </h1>
          <p className="text-xl text-[#9aa3b2] max-w-[650px] mx-auto leading-relaxed max-md:text-lg max-md:px-2 max-sm:text-sm max-sm:px-0">
            La infraestructura de pagos más robusta y segura para tu negocio. 
            Procesá transacciones, gestioná suscripciones y escalá tus ingresos sin límites.
          </p>
        </div>

        <div className="flex gap-6 flex-wrap justify-center animate-fade-up max-sm:gap-4">
          <Link href="/admin">
            <button className="min-w-[220px] py-[1.2rem] px-12 bg-white text-black border-none shadow-[0_10px_20px_rgba(255,255,255,0.1)] rounded-xl font-sans text-lg font-semibold tracking-wider cursor-pointer transition-all duration-150 hover:opacity-90 max-sm:min-w-full max-sm:w-full max-sm:py-4 max-sm:px-8 max-sm:text-base">
              Ingresar
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full max-w-[1100px] mt-16 max-lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] max-sm:gap-4 max-sm:mt-8 max-sm:grid-cols-1">
           {[
             { title: "Seguridad Bancaria", desc: "Cumplimiento con estándares PCI-DSS y encriptación de alta seguridad en cada movimiento." },
             { title: "Liquidación 24h", desc: "Recibí tu dinero en tu cuenta bancaria de forma ágil y sin complicaciones burocráticas." },
             { title: "Dashboard Global", desc: "Visualizá métricas en tiempo real, gestioná reembolsos y analizá el crecimiento de tu negocio." }
           ].map((feature, i) => (
             <div key={i} className="bg-[#111318] border border-[#222] rounded-3xl p-10 text-left animate-fade-up max-sm:p-6 max-sm:rounded-2xl" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                 <h3 className="font-display text-2xl text-white mb-4 max-sm:text-xl">{feature.title}</h3>
                 <p className="text-[0.95rem] text-[#666] leading-relaxed max-sm:text-sm">{feature.desc}</p>
             </div>
           ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
