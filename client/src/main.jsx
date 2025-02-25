import { createRoot } from "react-dom/client";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthPage } from "./routes/Auth";
import { Toaster } from "./components/ui/toaster";
import { HomePage } from "./routes/Home";
import { ClientEndpoints } from "./types/endpoints";
import { Battle } from "./routes/Battle";
import { NotFound } from "./routes/NotFound";

createRoot(document.getElementById("root")).render(
  <Provider>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path={ClientEndpoints.ROOT} element={<HomePage />} />
        <Route path={ClientEndpoints.AUTH} element={<AuthPage />} />
        <Route path={ClientEndpoints.BATTLE} element={<Battle />} />
        <Route path={ClientEndpoints.ANY} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
