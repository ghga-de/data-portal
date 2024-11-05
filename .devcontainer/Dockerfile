FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Copy install and launcher script to bin:
COPY ./dev_install /bin
COPY ./dev_launcher /bin

# Add some useful bash aliases:
RUN echo "alias ll='ls -al'" >/home/node/.bash_aliases

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
