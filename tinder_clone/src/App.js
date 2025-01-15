import "./App.css";
import Chats from "./Component/ChatC/Chats";
import ChatScreen from "./Component/ChatC/chatScreen";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Redirector from "./Redirector";
import ProtectedRoute from "./protectedRoute";
import { useSelector } from "react-redux";

import HomeScreen from "./Pages/HomeScreen/HomeScreen";
import LoginPage from "./Pages/LoginPage/LoginPage";
import GuestUserPage from "./Pages/GuestUserPage/GuestUserPage";

function App() {
  const { isAuthenticated } = useSelector((state) => state.root);
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/">
            <Route
              index={true}
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Chats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats/:person"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ChatScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <Redirector isAuthenticated={isAuthenticated}>
                  {/* <LoginPage /> */}
                  <GuestUserPage />

                </Redirector>
              }
            />
            <Route
              path="*"
              element={
                <div>
                  <h1>there is no path available with this route </h1>
                  <Link to="/">Go to Home</Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
