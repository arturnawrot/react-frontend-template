#!/usr/bin/env bash

set -o errexit
set -o pipefail

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
function node {
  _dc node "${@}"
}

function web {
  _dc web "${@}"
}

function payload {
  _dc payload "${@}"
}

function npm {
  node npm "${@}"
}

function run_dev {
  docker compose up node -d
  npm run dev
}

function run_prod {
  docker compose up web --build --force-recreate -d
}

function seed {
  payload pnpm seed
}

TIMEFORMAT=$'\nTask completed in %3lR'
time "${@:-help}"