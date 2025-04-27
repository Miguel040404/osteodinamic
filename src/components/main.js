const clases = [
    { nombre: "Pilates" },
    { nombre: "Rehabilitación funcional" },
    { nombre: "Entrenamiento pers." },
];

export default function Main() {
    return (
        <div className="flex flex-col justify-start items-center space-y-6 px-4 pt-4">
            {clases.map((clase, index) => (
                <button
                    key={index}
                    className="w-full max-w-lg bg-gray-200 text-xl py-14 px-6 rounded-2xl font-semibold shadow-md hover:bg-gray-300 transition-all"
                >
                    {clase.nombre}
                </button>
            ))}
        </div>
    );
}