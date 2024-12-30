import MainOutlet from "@outlets/main";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainOutlet />}>
                    <Route path="/" />
                    <Route path="/chat" />
                    <Route path="/install" />
                    <Route path="/settings" />
                </Route>
                <Route path="/*" /> {/* Here will pass 404 page */}
            </Routes>
        </BrowserRouter>
    );
}
