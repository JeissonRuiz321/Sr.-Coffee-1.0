import { useState } from "react";
import Landing    from "./components/Landing";
import Login      from "./components/Login";
import Onboarding from "./components/Onboarding";
import SrCoffee   from "./components/SrCoffee";

/*
  FLUJO:
  Landing → Login → Onboarding → SrCoffee
*/

export default function App() {
  const [screen, setScreen] = useState("landing");

  if (screen === "landing")    return <Landing    onNext={()  => setScreen("login")} />;
  if (screen === "login")      return <Login      onLogin={() => setScreen("onboarding")} />;
  if (screen === "onboarding") return <Onboarding onDone={()  => setScreen("chat")} />;

  return <SrCoffee onLogout={() => setScreen("landing")} />;
}
