FROM eclipse-temurin:21

WORKDIR /app

# Compile to /tmp/build (writable)
CMD ["sh", "-c", "mkdir -p /tmp/build && javac -d /tmp/build Main.java && java -cp /tmp/build Main"]
