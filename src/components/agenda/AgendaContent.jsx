import { AdminView } from "./AdminView";
import { HeaderAgenda } from "./HeaderAgenda";
import { UserView } from "./UserView";


export const AgendaContent = ({ reservas, esAdmin }) => {
  return (
    <>
      <HeaderAgenda esAdmin={esAdmin} />
      {esAdmin ? <AdminView reservas={reservas} /> : <UserView reservas={reservas} />}
    </>
  );
};