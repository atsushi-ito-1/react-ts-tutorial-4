import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { Game } from "./pages/Game";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const App = () => {
  return (
    <RecoilRoot>
      <Game />
    </RecoilRoot>
  );
};

const container = document.getElementById("root");
if (container) createRoot(container).render(<App />);

serviceWorkerRegistration.register();
reportWebVitals();
