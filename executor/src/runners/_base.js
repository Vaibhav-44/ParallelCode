const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const docker = new Docker();
const tar = require("tar-stream");

module.exports = async function run({ image, filename, code }) {
  const jobId = uuid();
  const containerJobDir = path.join(__dirname, "..", "..", "temp", jobId);

  // If HOST_TEMP is provided, use that host-visible path for binds so the
  // Docker daemon (running on the host) can read the files. Otherwise fall
  // back to the container-local path (works when Docker daemon shares the
  // same filesystem namespace).
  const hostTemp = process.env.HOST_TEMP;
  const hostJobDir = hostTemp ? path.join(hostTemp, jobId) : containerJobDir;

  // If a host-visible temp dir is provided, write the file there so jobs are
  // visible on the host. However, do NOT rely on bind-mounts to provide the
  // file inside the execution container (binds often fail on Docker Desktop
  // for Windows). Instead we always copy the file into the child container
  // using Docker's `putArchive` below.
  if (hostTemp) {
    fs.mkdirSync(hostJobDir, { recursive: true });
    fs.writeFileSync(path.join(hostJobDir, filename), code);
  }

  let stdout = "";
  let stderr = "";

  // Create the container without bind mounts and always copy the file into
  // it using `putArchive`. This avoids host-bind issues while still leaving
  // a host-visible copy when `HOST_TEMP` is configured.
  const createOpts = {
    Image: image,
    WorkingDir: "/app",
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      NetworkMode: "none",
      AutoRemove: true,
      Memory: 256 * 1024 * 1024,
      NanoCpus: 1e9,
    },
  };

  const container = await docker.createContainer(createOpts);

  // Always pack and copy the file into the container so `/app/${filename}`
  // exists regardless of host bind state.
  const pack = tar.pack();
  pack.entry({ name: filename, mode: 0o644 }, code);
  pack.finalize();
  await container.putArchive(pack, { path: "/app" });

  try {
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    docker.modem.demuxStream(
      stream,
      { write: (c) => (stdout += c.toString()) },
      { write: (c) => (stderr += c.toString()) }
    );

    await container.start();

    const timeout = setTimeout(async () => {
      try {
        await container.kill();
      } catch {}
    }, 3000);

    await container.wait();
    clearTimeout(timeout);
  } finally {
    try {
      fs.rmSync(hostJobDir, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }

  return { stdout, stderr, exitCode: 0 };
};
