FROM mcr.microsoft.com/devcontainers/typescript-node:4.0.1-trixie

RUN apt update && apt install -y dnsutils

# Add some useful bash aliases:
RUN echo "alias ll='ls -al'" >> /home/node/.bash_aliases

# Add local npm scripts to the path:
RUN echo "export PATH=\$PATH:/workspace/node_modules/.bin" >> /home/node/.bashrc

# Copy install and launcher script to bin:
COPY ./dev_install /usr/local/sbin
COPY ./dev_launcher /usr/local/bin

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
