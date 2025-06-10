
import { BellRing, BookOpenCheck } from 'lucide-react';
import LogoutButton from '../LogoutButton';
import PerfilLink from '../perfil-link';

export const PerfilActions = () => (
  <section className="max-w-3xl mx-auto mb-10 grid gap-4">
    <PerfilLink
      label="Normas"
      href="/normas"
      icon={<BookOpenCheck className="h-5 w-5 text-[#7b6658]" />}
    />
    <PerfilLink
      label="Notificaciones"
      href="/notificaciones"
      icon={<BellRing className="h-5 w-5 text-[#daa074]" />}
    />
    <LogoutButton />
  </section>
);
