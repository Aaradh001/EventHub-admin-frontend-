import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainWrapper from "./components/MainWrapper";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./pages/common/Loader";

function App() {
  return (
    <Router>
      
      <Provider store={store}>
        <Routes>
          <Route path="/*" element={<MainWrapper/>}></Route>
        </Routes>
      </Provider>
    </Router>
  );
}

export default App;