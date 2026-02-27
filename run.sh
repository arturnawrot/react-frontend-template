#!/usr/bin/env bash

set -o errexit
set -o pipefail

DOCKER_USERNAME=${1:-"arturnawrot"}
IMAGE_NAME="${DOCKER_USERNAME}/meybohm-frontend:latest"

# ---- config ----
# docker compose subcommand: exec (default) or run
DC="${DC:-exec}"

# pass a TTY only if stdout is a terminal
TTY=""
if [[ ! -t 1 ]]; then
  TTY="-T"
fi

# ---- internal wrapper ----
function _dc {
  docker compose "${DC}" ${TTY} "${@}"
}

# ---- node/npm helpers ----
function payload {
  _dc payload "${@}"
}

function payload-production {
  _dc payload-production "${@}"
}


function npm {
  node npm "${@}"
}

function run_dev {
  docker compose up mongo payload --build --force-recreate -d
}

function run_prod_build_local {
  docker compose up payload-production --build --force-recreate -d
}

function fetch_latest_image {
  git pull
  docker pull arturnawrot/meybohm-frontend:latest
}

function run_prod {
  docker compose -f docker-compose.production.yml up -d payload-production
}

function seed {
  payload pnpm seed
}

function seed-production {
  payload-production pnpm seed
}

TIMEFORMAT=$'\nTask completed in %3lR'
time "${@:-help}"