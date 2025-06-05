'use client';

export default function Header() {

  return (
    <header className='bg-[#e8d7c3] text-white p-4 shadow-lg w-full flex justify-between items-center'>

      <div className="flex items-center">
        <a href="/home" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="bg-white rounded-full p-1 mr-3 shadow-md">
            <img
              src="/images/logo.png"
              alt="Logo de la aplicación"
              width={60}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4d4037] ">Clínica Osteodinamic</h1>
            <h2 className="text-[13px] text-[#4d4037] mt-1 text-center">Especialistas en Estilo de Vida</h2>
          </div>
        </a>
      </div>
    </header>
  );
}