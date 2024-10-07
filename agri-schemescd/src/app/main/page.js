import Navbar from "../components/main/navbar/navbar";
import MidBody from "../components/main/midBody/midBody";
import RightBar from "../components/main/rightBar/rightBar";
import LeftBar from "../components/main/leftBar/leftBar";
import Footer from "../components/main/footer/footer";


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
