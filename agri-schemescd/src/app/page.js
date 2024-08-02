import Navbar from "./components/navbar/navbar";
import MidBody from "./components/midBody/midBody";
import RightBar from "./components/rightBar/rightBar";
import LeftBar from "./components/leftBar/leftBar";
import Footer from "./components/footer/footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bodyy">
        <LeftBar/>
      <MidBody />
      <RightBar/>
      </div>
      <Footer/>
     
      
    </>
  );
}
