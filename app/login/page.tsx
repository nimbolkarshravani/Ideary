import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div
      className="ruled-lines"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <LoginForm />
    </div>
  );
}
