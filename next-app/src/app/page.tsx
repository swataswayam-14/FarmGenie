import Image from "next/image";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { Appbar } from "./components/AppBar";

export default function Home() {
  return (
   <div>
    {/* <Appbar/> */}
    <Hero/>
    <Footer/>
   </div>
  );
}
