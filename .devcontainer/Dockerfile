FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Copy install and launcher script to bin:
COPY ./dev_install /bin
COPY ./dev_launcher /bin

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
