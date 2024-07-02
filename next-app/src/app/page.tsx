import Image from "next/image";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
   <div>
    <Hero/>
    <Footer/>
   </div>
  );
}
