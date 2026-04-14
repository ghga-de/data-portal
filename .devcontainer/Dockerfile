FROM mcr.microsoft.com/devcontainers/typescript-node:4.0.6-trixie

RUN apt-get update && apt-get install -y --no-install-recommends \
  # Network utilities
  dnsutils \
  # CLI tools for developer and AI agent workflows (see AGENTS.md)
  ripgrep jq fd-find shellcheck shfmt bat \
  && rm -rf /var/lib/apt/lists/* \
  # Debian installs fd and bat under fdfind/batcat; add canonical short names
  && ln -sf /usr/bin/fdfind /usr/local/bin/fd \
  && ln -sf /usr/bin/batcat /usr/local/bin/bat

# Add some useful bash aliases:
RUN echo "alias ll='ls -al'" >> /home/node/.bash_aliases

# Add local npm scripts to the path:
RUN echo "export PATH=\$PATH:/workspace/node_modules/.bin" >> /home/node/.bashrc

# Copy install and launcher script to bin:
COPY ./dev_install /usr/local/sbin
COPY ./dev_launcher /usr/local/bin

# Don't shut down after the process ends:
CMD ["sleep", "infinity"]
