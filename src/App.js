import "./App.css";
import { GlobalStyle } from "./GlobalStyle.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Room from "./pages/meetingRoom/Room.jsx";
import Create from "./pages/meetingRoom/Create.jsx";

function App() {
  return (
    <>
      <div className="App">
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/createRoom" element={<Create />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
