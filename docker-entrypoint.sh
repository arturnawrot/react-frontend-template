#!/bin/sh
set -e

# Ensure media directory exists and has correct permissions
# This is needed when using volume mounts from the host
mkdir -p /app/media
chown -R nextjs:nodejs /app/media 2>/dev/null || true
chmod -R 755 /app/media 2>/dev/null || true

# Execute the main command as the nextjs user
exec su-exec nextjs "$@"

