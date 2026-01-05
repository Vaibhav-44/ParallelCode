FROM rust:1.76

WORKDIR /app

# Force rustc to use /tmp for temp files and output binary
CMD ["sh", "-c", "export TMPDIR=/tmp && rustc main.rs -o /tmp/main && /tmp/main"]
