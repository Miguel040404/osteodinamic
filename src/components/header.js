'use client';
import React from 'react';

export default function Header() {
  return (
    <header className='bg-[rgb(41,54,66)] text-white p-2 shadow-md w-full'>
      <div className="flex items-center">
        <a href="/home">
          <img src="/images/logo.png" alt="Logo de la aplicación" width={80} />
        </a>
        <div className="text-center">
          <h1 className="text-2xl font-[Montserrat]">Osteodinamic</h1>
          <h2 className="text-sm">Salud Integrativa</h2>
        </div>
      </div>
    </header>
  );
}