import { Routes, Route } from "react-router-dom";
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import DashBoard from '../pages/DashBoard';
import Profile from "../pages/Profile";
import New from "../pages/New";

import Private from "./Private";
import Customers from "../pages/Customers";

function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/register" element={<SignUp/>}/>
            <Route path="/dashboard" element={<Private><DashBoard/></Private>}/>
            <Route path="/profile" element={<Private><Profile/></Private>}/>
            <Route path="/customers" element={<Private><Customers/></Private>}/>
            <Route path="/new" element={<Private><New/></Private>}/>
            <Route path="/new/:id" element={<Private><New/></Private>}/>
        </Routes>
    )
}

export default RoutesApp;