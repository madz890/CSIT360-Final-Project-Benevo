import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
<<<<<<< Updated upstream
// import AppRoutes from "./routes/AppRoutes";
=======
import AppRoutes from "./routes/AppRoutes";
>>>>>>> Stashed changes

function App() {
  return (
    <BrowserRouter>
      <Navbar />
<<<<<<< Updated upstream
      <Home />
=======
      <AppRoutes/>
>>>>>>> Stashed changes
      <Footer />
    </BrowserRouter>
  );
}

export default App;