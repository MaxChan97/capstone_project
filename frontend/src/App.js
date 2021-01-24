import "./App.css";
import { Switch, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";
import LandingPage from "./screens/LandingPage";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
