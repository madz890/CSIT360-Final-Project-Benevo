import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabaseConfigMessage } from "../lib/supabase";
import AuthToggle from "../components/AuthToggle";
import FormField from "../components/FormField";

function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "login") {
        await signIn(email, password);
        setMessage("Signed in successfully.");
        navigate("/dashboard");
      } else {
        await signUp(email, password, role);
        setMessage(
          "Account created. Please check your email for the confirmation link.",
        );
      }
    } catch (error) {
      setMessage(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
      {supabaseConfigMessage ? (
        <p className="hint">{supabaseConfigMessage}</p>
      ) : null}
      <form onSubmit={handleSubmit}>
        <FormField label="Email">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Password">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormField>
        {mode === "signup" ? (
          <FormField label="Role">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="organization">Organization</option>
            </select>
          </FormField>
        ) : null}
        <button type="submit" disabled={loading}>
          {loading
            ? "Working..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
      <AuthToggle
        mode={mode}
        onToggle={() => setMode(mode === "login" ? "signup" : "login")}
      />
      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}

export default Auth;
