const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const docker = new Docker();

module.exports = async function run({
  image,
  filename,
  code
}) {
  const jobId = uuid();
  const jobDir = path.join(__dirname, "..", "..", "temp", jobId);

  fs.mkdirSync(jobDir, { recursive: true });
  fs.writeFileSync(path.join(jobDir, filename), code);

  let stdout = "";
  let stderr = "";

  const container = await docker.createContainer({
    Image: image,
    WorkingDir: "/app",
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      Binds: [`${jobDir}:/app:ro`],
      NetworkMode: "none",
      AutoRemove: true,
      Memory: 256 * 1024 * 1024,
      NanoCpus: 1e9
    }
  });

  try {
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true
    });

    docker.modem.demuxStream(
      stream,
      { write: (c) => (stdout += c.toString()) },
      { write: (c) => (stderr += c.toString()) }
    );

    await container.start();

    const timeout = setTimeout(async () => {
      try { await container.kill(); } catch {}
    }, 3000);

    await container.wait();
    clearTimeout(timeout);
  } finally {
    fs.rmSync(jobDir, { recursive: true, force: true });
  }

  return { stdout, stderr, exitCode: 0 };
};
