export default function LaunchpadTest() {
  console.log("LaunchpadTest component rendering");

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div
          style={{
            backgroundColor: "green",
            padding: "20px",
            color: "white",
            marginBottom: "20px",
          }}
        >
          ✅ LAUNCHPAD TEST - RENDERING SUCCESSFULLY!
        </div>

        <h1 className="text-4xl font-bold mb-6">
          Test <span className="gradient-text">Launchpad</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          This is a simple test version to verify routing and basic rendering
          works.
        </p>

        <div className="bg-blue-500 text-white p-4 rounded">
          If you can see this, the Launchpad route is working!
        </div>
      </div>
    </div>
  );
}
