import { NotificationButton } from "./NotificationButton";

export const HomeHeader = ({ notificationCount }) => (
  <div className="flex justify-between items-center mb-8 sm:flex-row flex-col-reverse">
    <div>
      <p className="text-[#4d4037] mt-2">Descubre nuestras clases disponibles</p>
    </div>
    <NotificationButton count={notificationCount} />
  </div>
);