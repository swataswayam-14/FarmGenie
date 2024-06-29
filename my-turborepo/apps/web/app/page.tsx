import Image from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ChatComponent from "./components/ChatComponent";

export default function Home() {
  return (
   <div>
    {/* <SignUp/>
    <SignIn/> */}
    <ChatComponent/>
   </div>
  );
}
