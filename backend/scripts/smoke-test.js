const assert = require("node:assert/strict");
const app = require("../src/app");

const run = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${baseUrl}/`);
    assert.equal(health.status, 200);
    assert.equal(health.headers.get("x-powered-by"), null);
    assert.equal(health.headers.get("x-content-type-options"), "nosniff");

    const notFound = await fetch(`${baseUrl}/api/not-real`);
    assert.equal(notFound.status, 404);

    const escalation = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "candidate",
        email: "candidate@example.com",
        password: "123456",
        role: "admin",
      }),
    });
    assert.equal(escalation.status, 400);
    const escalationBody = await escalation.json();
    assert.equal(escalationBody.details[0].field, "role");

    const polluted = await fetch(`${baseUrl}/api/questions/bank?tag=a&tag=b`);
    assert.equal(polluted.status, 400);

    const adminQuestionsWithoutToken = await fetch(`${baseUrl}/api/questions`);
    assert.equal(adminQuestionsWithoutToken.status, 401);

    const blockedOrigin = await fetch(`${baseUrl}/`, {
      headers: { origin: "https://untrusted.example" },
    });
    assert.equal(blockedOrigin.status, 403);

    const oversized = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "a@example.com", password: "x".repeat(11000) }),
    });
    assert.equal(oversized.status, 413);

    console.log("Smoke tests passed: headers, 404, role protection, CORS, HPP and body limit.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
