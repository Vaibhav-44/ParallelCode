FROM gcc:13
WORKDIR /app
CMD ["sh", "-c", "g++ main.cpp -O2 -o /tmp/main && /tmp/main"]
