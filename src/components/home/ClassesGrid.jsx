import { ClassCard } from "./ClassCard";

export const ClassesGrid = ({ classCounts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ClassCard
      href="/clases/pilates/pilates" 
      imageSrc="/images/PILATES-scaled.jpg" 
      title="Pilates Terapéutico" 
      count={classCounts.pilates} 
      gradientColor="bg-[#e4b4a0]" 
      badgeColor="bg-[#e39d7f]"
    />
    <ClassCard 
      href="/clases/rehabilitacion_funcional/rehabilitacion_funcional" 
      imageSrc="/images/rehabilitacion.jpg" 
      title="Rehabilitación Funcional" 
      count={classCounts.rehabilitacion_funcional} 
      gradientColor="bg-[#b9b59c]" 
      badgeColor="bg-[#898473]"
    />
    <ClassCard 
      href="/clases/entrenamiento_personal/entrenamiento_personal" 
      imageSrc="/images/entrenamiento.jpg" 
      title="Salud Activa Personal" 
      count={classCounts.entrenamiento_personal} 
      gradientColor="bg-[#a57551]" 
      badgeColor="bg-[#c3895d]"
    />
  </div>
);