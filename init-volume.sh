#!/bin/bash
# This script initializes the static assets volume on first run

# Always ensure critical directories exist
mkdir -p /usr/src/app/static/assets
mkdir -p /usr/src/app/static/email/templates/partials

# Check if the volume is empty or missing critical directories
if [ -z "$(ls -A /usr/src/app/static 2>/dev/null)" ] || 
   [ ! -d "/usr/src/app/static/email/templates/partials" ] || 
   [ -z "$(ls -A /usr/src/app/static/email/templates/partials 2>/dev/null)" ]; then
    
    echo "Volume needs initialization, copying static files..."
    
    # Copy all static files to the volume
    cp -r /usr/src/app/initial-static/* /usr/src/app/static/ 2>/dev/null || echo "No files to copy from initial-static"
    
    # Double-check that email template directories exist
    mkdir -p /usr/src/app/static/email/templates/partials
    
    # If partials are still missing, create minimal versions
    if [ ! -f "/usr/src/app/static/email/templates/partials/header.hbs" ]; then
        echo "Creating minimal header.hbs"
        echo '{{!-- Default header --}}' > /usr/src/app/static/email/templates/partials/header.hbs
    fi
    
    if [ ! -f "/usr/src/app/static/email/templates/partials/footer.hbs" ]; then
        echo "Creating minimal footer.hbs"
        echo '{{!-- Default footer --}}' > /usr/src/app/static/email/templates/partials/footer.hbs
    fi
    
    echo "Static files and directories initialized."
else
    echo "Volume already contains necessary files, skipping initialization."
fi

echo "Volume initialization completed. Directory structure:"
find /usr/src/app/static -type d | sort

# Start the application
exec node dist/index.js
