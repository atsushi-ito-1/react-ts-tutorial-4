import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { Game } from "./pages/Game";

const App = () => {
  return (
    <RecoilRoot>
      <Game />
    </RecoilRoot>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
