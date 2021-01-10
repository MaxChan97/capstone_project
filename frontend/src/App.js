import "./App.css";
import { Switch, Route } from "react-router-dom";
import Login from "./screens/Login";
import Register from "./screens/Register";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </div>
  );
}

export default App;
