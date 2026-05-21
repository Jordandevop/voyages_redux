import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout(){

    return(
        <>
         <Navbar/>
        <Container className="py-4">
            <Outlet/>

        </Container>
        </>
       
    )
}

export default MainLayout;