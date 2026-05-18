import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


// La Navbar est commune à toutes les pages de mon projet
// outlet est l'emplacement ou react router affichera la page correspondante à l'url
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