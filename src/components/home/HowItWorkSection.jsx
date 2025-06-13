import { HowItWorksStep } from "./HowItWorksStep";


export const HowItWorksSection = () => (
  <div className="mt-12 bg-white rounded-xl shadow-md p-6 mb-5">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo funciona?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <HowItWorksStep
        number="1" 
        title="Accede a tu servicio contratado" 
        description="Pilates Terapéutico, Rehabilitación Funcional o Salud Activa Personal." 
      />
      <HowItWorksStep 
        number="2" 
        title="¿No puedes asistir?" 
        description="Cancela tu clase con antelación y reserva según la disponibilidad." 
      />
      <HowItWorksStep 
        number="3" 
        title="Disfruta tu clase" 
        description="Aprovecha tu clase y mejora tu bienestar con nosotros." 
      />
    </div>
  </div>
);