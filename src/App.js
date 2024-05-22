import "./App.css";
import { GlobalStyle } from "./GlobalStyle.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Room from "./pages/meetingRoom/Room.jsx";
import Create from "./pages/meetingRoom/Create.jsx";
import Join from "./pages/meetingRoom/Join.jsx";
import Record from "./pages/meetingRecord/Records.jsx";
import RecordDetail from "./pages/meetingRecord/RecordDetail.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

function App() {
  return (
    <>
      <div className="App">
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/createRoom" element={<Create />} />
            <Route path="/joinRoom" element={<Join />} />
            <Route path="/meetingRecord" element={<Record />} />
            <Route path="/meetingRecordDetail" element={<RecordDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
