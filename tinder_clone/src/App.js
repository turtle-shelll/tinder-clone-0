import "./App.css";
import Header from "./Component/HeaderC/Header";
import TinderCards from "./Component/Card/Card";
import Footer from "./Component/FooterC/Footer";
import Chats from "./Component/ChatC/Chats";
import ChatScreen from "./Component/ChatC/chatScreen";
// import UpdateImage from "./Component/ChatC/update_Image";
// import BottomNav from "./Component/bottomNav/BottomNav";

// import Login from "./Component/loginC/Login";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Component/loginC/Login";
// import Glogin from "./Component/loginC/Glogin";
import Logout from "./Component/loginC/Logout";
import { useEffect } from "react";
import Redirector from "./Redirector";
import ProtectedRoute from "./protectedRoute";
import { useSelector } from "react-redux";

// import { GoogleApiProvider } from "react-gapi";
// import { MyAuthComponent } from "./Component/loginC/MyAuthComponent";
import { gapi } from "gapi-script";

const HomeElement = () => {
  return (
    <div>
      <Header />
      <TinderCards />
      <Footer />
    </div>
  );
};
const LoginPage = () => {
  const clientId =
    "1019713917495-eo8ocq6ucpd0nlejgauvlq9gckmmor6p.apps.googleusercontent.com";
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  return (
    <>
      <div className="g-signin">
        {/* <Login /> */}
        {/* <Glogin /> */}
        <Logout />
        <Login />
      </div>
      {/* <GoogleApiProvider clientId={clientId}> */}
      {/* <MyAuthComponent /> */}
      {/* </GoogleApiProvider> */}
    </>
  );
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.root);
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/">
            <Route
              // path="/"
              index={true}
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <HomeElement />
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
                // <ProtectedRoute isAuthenticated={isAuthenticated}>
                //   <LoginPage />
                // </ProtectedRoute>

                <Redirector isAuthenticated={isAuthenticated}>
                  <LoginPage />
                </Redirector>
              }
            />
            {/* <Route
              path="/update_image/:Id"
              element={
                // <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateImage />
                // </ProtectedRoute>
              }
            /> */}
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
