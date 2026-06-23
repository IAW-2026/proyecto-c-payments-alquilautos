import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,#1e1b4b,transparent),radial-gradient(circle_at_bottom_left,#09090b,#000)] text-white p-8 max-md:p-6 max-sm:p-3">
      <div className="flex flex-col items-center gap-6 max-w-[480px] w-full max-sm:gap-3">
        <div className="text-center mb-2">
          <span className="text-[0.85rem] font-semibold tracking-[0.2em] text-indigo-500 uppercase max-sm:text-[0.7rem]">Plataforma de Pagos</span>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mt-2 mb-1 max-md:text-[1.75rem] max-sm:text-[1.35rem]">ALQUILAUTOS</h1>
          <p className="text-slate-400 text-[0.95rem] max-sm:text-[0.8rem]">
            Registrá tu cuenta para empezar a gestionar transacciones.
          </p>
        </div>

        <div className="w-full flex justify-center rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_rgba(99,102,241,0.1)] max-sm:rounded-xl">
          <SignUp />
        </div>
      </div>
    </main>
  );
}
