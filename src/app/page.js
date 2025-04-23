

// export default function Home() {
//   return (
//     <p>pollo 1 </p>
//   );
// }

import { redirect } from "next/navigation"; // IMPORTANTE: importar desde next/navigation


export default function RootPage() {
  redirect('/auth/login')
}