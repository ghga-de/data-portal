FROM mcr.microsoft.com/devcontainers/typescript-node:1.1.8-22-bookworm

RUN apt update && apt install -y dnsutils

# Add some useful bash aliases:
RUN echo "alias ll='ls -al'" >> /home/node/.bash_aliases

# Add local npm scripts to the path:
RUN echo "export PATH=\$PATH:/workspace/node_modules/.bin" >> /home/node/.bashrc

# Copy install and launcher script to bin:
COPY ./dev_install /usr/local/sbin
COPY ./dev_launcher /usr/local/bin

# Currently the proxy middleware is not working properly with require(esm):
ENV NODE_OPTIONS="--no-experimental-require-module"

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
