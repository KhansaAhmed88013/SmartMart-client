import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../UserService";
import { UserContext } from "../../Context/UserContext";
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/Role/roleSlice";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ username, password, rememberMe });

      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        const decoded = jwtDecode(response.token);

        dispatch(setRole(decoded.role));

        const userData = {
          id: decoded.id,
          role: decoded.role,
          username: response.user?.username,
          full_name: response.user?.full_name,
        };
        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));

        if (decoded.role === "Admin") navigate("/");
        else if (decoded.role === "Cashier") navigate("/cashier");
      } else {
        setError(response.message || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  if (currentUser && token) {
    const decoded = jwtDecode(token);
    return (
      <div className="login-container already-logged">
        <h2>
          You are already logged in as{" "}
          {currentUser.username || currentUser.full_name}
        </h2>
        <button
          onClick={() => {
            if (decoded.role === "Admin") navigate("/");
            else if (decoded.role === "Cashier") navigate("/cashier");
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const NavigateToOTP = () => {
    navigate("/recovery/Recovery-Info");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setError("");
          NavigateToOTP();
        }}
      >
        Forgot Password?
      </a>
    </div>
  );
};

export default Login;
