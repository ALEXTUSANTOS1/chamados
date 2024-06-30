import { BrowserRouter } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import RoutesApp from "./routes"; 

import 'react-toastify/dist/ReactToastify.css';

import AuthPrivider from "./contexts/auth";
function App() {
  return (
    <BrowserRouter>
      <AuthPrivider>
        <ToastContainer autoClose={3000}/>
        <RoutesApp/>
      </AuthPrivider>
    </BrowserRouter>
  );
}

export default App;
