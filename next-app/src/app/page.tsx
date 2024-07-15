import { Hero } from "./components/Hero";
import { Appbar } from "./components/AppBar";
import { middleware } from "@/monitoring/monitoringmiddleware";

export default function Home() {
  return (
   <div>
    <Appbar/>
    <Hero/>
   </div>
  );
}

export const config = {
  matcher:'/',
  middleware: [middleware]
}