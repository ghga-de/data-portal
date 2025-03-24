FROM mcr.microsoft.com/devcontainers/typescript-node:1.1.9-22-bookworm

RUN apt update && apt install -y dnsutils

RUN apt install -y libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libasound2 libatspi2.0-0

# Add some useful bash aliases:
RUN echo "alias ll='ls -al'" >> /home/node/.bash_aliases

# Add local npm scripts to the path:
RUN echo "export PATH=\$PATH:/workspace/node_modules/.bin" >> /home/node/.bashrc

# Copy install and launcher script to bin:
COPY ./dev_install /usr/local/sbin
COPY ./dev_launcher /usr/local/bin

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
