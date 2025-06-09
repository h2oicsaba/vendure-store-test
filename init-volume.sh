#!/bin/bash
# This script initializes the static assets volume on first run

# Check if the volume is empty
if [ -z "$(ls -A /usr/src/app/static 2>/dev/null)" ]; then
    echo "Volume is empty, copying all static files..."
    # Copy all static files to the volume
    cp -r /usr/src/app/initial-static/* /usr/src/app/static/
    echo "Static files copied to volume."
else
    echo "Volume already contains files, skipping initialization."
fi

echo "Volume initialization completed."

# Start the application
exec node dist/index.js
