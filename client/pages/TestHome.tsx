export default function TestHome() {
  console.log("TestHome component is rendering!");

  return (
    <div>
      <h1>🐑 TEST HOME - WORKING!</h1>
      <p>If you see this text, React Router is working!</p>
      <p>Navigation is above, main content is here.</p>
      <div
        style={{
          backgroundColor: "red",
          height: "200px",
          width: "100%",
          color: "white",
          fontSize: "24px",
          padding: "20px",
        }}
      >
        BIG RED BOX - VISIBLE TEST
      </div>
    </div>
  );
}
