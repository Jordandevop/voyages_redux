import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Footer from "../components/Footer";

function MainLayout() {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", mode);
  }, [mode]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
