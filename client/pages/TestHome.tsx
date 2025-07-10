export default function TestHome() {
  return (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "20px",
        margin: "20px",
        minHeight: "400px",
      }}
    >
      <h1>🔴 TESTING - IF YOU SEE THIS, ROUTES ARE WORKING!</h1>
      <p>This is a super basic test component</p>
      <p>Background: red, text: white</p>
      <p>If this shows up, the problem is with other components</p>
    </div>
  );
}
