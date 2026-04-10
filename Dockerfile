# syntax=docker/dockerfile:1
FROM node:22-slim AS base

# USER_UID can be passed at build time to match the host user
ARG USER_UID=1000
ARG USER_GID=1000

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    procps \
    coreutils \
    bash \
    sudo \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# node:22-slim ships with a 'node' user (UID 1000); remove it and create 'appuser'
RUN userdel node 2>/dev/null || true && rm -rf /home/node && \
    groupadd --gid ${USER_GID} appuser && \
    useradd --uid ${USER_UID} --gid ${USER_GID} --shell /bin/zsh --create-home appuser && \
    echo "appuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN mkdir -p /workspace && chown appuser:appuser /workspace

USER appuser
WORKDIR /workspace

# ── development ────────────────────────────────────────────────────────────────
FROM base AS development

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    less \
    wget \
    jq \
    gnupg \
    unzip \
    zsh \
    ripgrep \
    fd-find \
    && rm -rf /var/lib/apt/lists/*

# GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      -o /usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list && \
    apt-get update && apt-get install -y gh && \
    rm -rf /var/lib/apt/lists/*

# Neovim — install from official releases (apt version is too old for LazyVim)
RUN wget -q https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz \
      -O /tmp/nvim.tar.gz && \
    tar -xzf /tmp/nvim.tar.gz -C /opt && \
    ln -sf /opt/nvim-linux-x86_64/bin/nvim /usr/local/bin/nvim && \
    rm /tmp/nvim.tar.gz

# Create Claude config dir and node_modules with correct ownership before switching users
RUN mkdir -p /home/appuser/.claude && chown -R appuser:appuser /home/appuser/.claude && \
    mkdir -p /workspace/node_modules && chown appuser:appuser /workspace/node_modules

USER appuser

# Claude Code CLI
RUN curl -fsSL https://claude.ai/install.sh | bash

ENV PATH="/home/appuser/.local/bin:$PATH"
