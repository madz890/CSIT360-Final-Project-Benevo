function AuthToggle({ mode, onToggle }) {
  return (
    <button className="toggle-btn" onClick={onToggle}>
      {mode === "login" ? "Need an account?" : "Already have an account?"}
    </button>
  );
}

export default AuthToggle;
