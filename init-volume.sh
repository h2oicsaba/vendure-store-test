#!/bin/bash
# This script initializes the static assets volume on first run

# Create necessary directories if they don't exist
mkdir -p /usr/src/app/static/assets
mkdir -p /usr/src/app/static/email/templates/partials

# Copy default assets if they don't exist
if [ -d "/usr/src/app/initial-static/assets" ] && [ -z "$(ls -A /usr/src/app/static/assets 2>/dev/null)" ]; then
    echo "Copying default assets to volume..."
    cp -r /usr/src/app/initial-static/assets/* /usr/src/app/static/assets/
    echo "Default assets copied to volume."
fi

# Copy email templates if they don't exist
if [ -d "/usr/src/app/node_modules/@vendure/email-plugin/templates" ]; then
    echo "Copying default email templates..."
    cp -r /usr/src/app/node_modules/@vendure/email-plugin/templates/* /usr/src/app/static/email/templates/
    
    # Ensure partials directory exists
    mkdir -p /usr/src/app/static/email/templates/partials
    
    # Copy partials if they exist
    if [ -d "/usr/src/app/node_modules/@vendure/email-plugin/templates/partials" ]; then
        cp -r /usr/src/app/node_modules/@vendure/email-plugin/templates/partials/* /usr/src/app/static/email/templates/partials/
    fi
    
    echo "Default email templates copied to volume."
fi

echo "Volume initialization completed."
