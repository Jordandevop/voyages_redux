// Avec React Router, il est possible de déplacer la logique de navigation dans un fichier dédié.
// Dans ce projet, on ne servira pas de App.jsx
// Avant : main.jsx => App.jsx => components/pages
// Sur ce projet : main.jsx => RouterProvider => Router.jsx => Layjout/Pages.jsx


import { createBrowserRouter } from "react-router-dom";
// permet de créer un router moderne sur les urls du navigateur
import MainLayout from "../layouts/MainLayout"
import HomePage from "../pages/HomePage"
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";
import DestinationPage from "../pages/DestinationsPage";
import DestinationDetailPage from "../pages/DestinationDetailPage";
import SearchPage from "../pages/SearchPage";
import ContactPage from "../pages/ContactPage";
import RegionPage from "../pages/RegionPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

const router = createBrowserRouter([

    {
        path:"/",
        element: <MainLayout/>,
        // toutes les pages utilisent MainLayout
        errorElement: <NotFoundPage/>,
        children: [
            {
                index: true,
                // cette page est la page par défaut
                // index : true = path: ""( deuxieme écriture possible)
                element: <HomePage/>
            },
            {
                path: "about",
                element: <AboutPage/>
            },
            {
                path: "destination",
                element: <DestinationPage/>
            },
            {
                path:"destination/:slug",
                element: <DestinationDetailPage/>
            },
            {
                path: "search",
                element: <SearchPage/>
            },{
                path:"contact",
                element: <ContactPage/>
            },
            {
                path:"region/:regionName",
                element: <RegionPage/>
            },
            {
                path: "register",
                element: <RegisterPage/>
            },
            {
                path: "login",
                element: <LoginPage/>
            },
            {
                path: "*",
                element: <NotFoundPage/>
            }
        ]
    }

]);

export default router;