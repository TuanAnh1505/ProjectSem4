import React, { useState } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/register";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login switchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default App;
