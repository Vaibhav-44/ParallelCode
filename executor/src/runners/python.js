const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const docker = new Docker();

module.exports = async function runPython(code, stdin = "") {
  const jobId = uuid();
  const jobDir = path.join(__dirname, "..", "..", "temp", jobId);

  // 1. Prepare temp directory
  fs.mkdirSync(jobDir, { recursive: true });
  fs.writeFileSync(path.join(jobDir, "main.py"), code);

  let stdout = "";
  let stderr = "";

  // 2. Create container
  const container = await docker.createContainer({
    Image: "code-i-python",
    Cmd: ["python3", "main.py"],
    WorkingDir: "/app",
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      Binds: [`${jobDir}:/app:ro`],
      NetworkMode: "none",
      AutoRemove: true,
      Memory: 256 * 1024 * 1024, // 256 MB
      NanoCpus: 1e9, // 1 CPU
    },
  });

  try {
    // 3. Attach BEFORE start (critical)
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    docker.modem.demuxStream(
      stream,
      {
        write: (chunk) => {
          stdout += chunk.toString();
        },
      },
      {
        write: (chunk) => {
          stderr += chunk.toString();
        },
      }
    );

    // 4. Start container
    await container.start();

    // 5. Enforce execution timeout
    const timeout = setTimeout(async () => {
      try {
        await container.kill();
      } catch {}
    }, 3000);

    // 6. Wait for execution to finish
    await container.wait();

    clearTimeout(timeout);
  } finally {
    // 7. Cleanup temp directory
    fs.rmSync(jobDir, { recursive: true, force: true });
  }

  return {
    stdout,
    stderr,
    exitCode: 0,
  };
};
