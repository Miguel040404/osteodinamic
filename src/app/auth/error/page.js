
// https://next-auth.js.org/configuration/pages#error-page
const errors = new Map();
errors.set('Configuration', "Hay un problema con la configuración del servidor. Comprueba si tus opciones son correctas.");
errors.set('AccessDenied', "Acceso denegado.");
errors.set('Verification', "El token ha caducado o ya ha sido utilizado. Relacionado con el proveedor de correo electrónico.");
errors.set('Default', "Ocurrió un error inesperado.");


async function page({ searchParams }) {
  const { error } = await searchParams;

  return (
    <>
      <h1>Error</h1>
      {error && <h3>{errors.get(error)}</h3>}
    </>

  )
}

export default page