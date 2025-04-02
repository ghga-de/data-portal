#!/bin/bash

cd "$(dirname "$0")"

if [ ! -f local.env ]; then
    echo "Initializing local.env - please check and adapt."
    echo "This is mainly needed to setup secrets for running with the staging backend."
    F=local.env
    echo "# data_portal_base_url=https://data.staging.ghga.dev" > $F
    echo "# data_portal_basic_auth=user:passwd" >>$F
    echo "# data_portal_oidc_client_id=ghga-dev-client" >>$F
fi

if [ ! -f docker-compose.local.yml ]; then
    echo "Initializing docker-compose.local.env - please check and adapt."
    echo "This is mainly needed to integrate the X11 Server for e2e tests with UI."

    X11_DIR="/tmp/.X11-unix"
    AUTH_DIR=""
    DISPLAY=":0"

    UNAME=$(uname -a)
    shopt -s nocasematch
    if [[ "$UNAME" =~ macos|darwin ]]; then
        echo "You seem to be using macOS."
        echo "It is recommended to install XQuartz as X11 server."
        AUTH_DIR="~/.Xauthority"
        DISPLAY="host.docker.internal:0"
    elif [[ "$UNAME" =~ microsoft|windows|wsl ]]; then
        echo "You seem to be using WSL."
        echo "This already contains an X11 server as part of WSLg."
        X11_DIR="/mnt/wslg/.X11-unix"
    else
        echo "No specific host environment detected."
    fi

    F="docker-compose.local.yml"
    echo "services:" > $F
    echo "  app:" >>$F

    if [ "$X11_DIR$AUTH_DIR" != "" ]; then
        echo "    volumes:" >> $F
        if [ "$X11_DIR" != "" ]; then
            echo "      - $X11_DIR:/tmp/.X11-unix" >> $F
        fi
        if [ "$AUTH_DIR" != "" ]; then
            echo "      - $AUTH_DIR:/root/.Xauthority" >> $F
        fi
    fi
    if [ "$DISPLAY" != "" ]; then
        echo "    environment:" >> $F
        echo "      - DISPLAY=$DISPLAY" >> $F
    fi
fi
