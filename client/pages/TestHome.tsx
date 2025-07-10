export default function TestHome() {
  return (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "40px",
        margin: "20px",
        minHeight: "500px",
      }}
    >
      <h1 style={{ color: "white", fontSize: "48px" }}>
        🐑 TEST HOME - WORKING!
      </h1>
      <p style={{ color: "white", fontSize: "24px" }}>
        If you see this red box, React Router is working!
      </p>
      <p style={{ color: "white", fontSize: "18px" }}>
        Navigation is above, main content is here.
      </p>
    </div>
  );
}
