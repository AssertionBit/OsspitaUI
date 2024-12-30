import Router from "./router";
import "./App.css";

export default function App() {
    if(import.meta.env.DEV) {
        console.debug("Btw, you should never see this message...");
    }

    return (
        <Router />
    );
}
