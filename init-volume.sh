#!/bin/bash
# This script initializes the static assets volume on first run

# Check if the assets directory exists on the volume
if [ ! -d "/usr/src/app/static/assets" ]; then
    echo "Creating assets directory on volume..."
    mkdir -p /usr/src/app/static/assets
fi

# Check if the assets directory is empty
if [ -z "$(ls -A /usr/src/app/static/assets)" ]; then
    echo "Initializing assets directory with example content..."
    # Copy example assets from the image to the volume
    # The source directory depends on where the initial assets are stored in your Docker image
    if [ -d "/usr/src/app/initial-static/assets" ]; then
        cp -r /usr/src/app/initial-static/assets/* /usr/src/app/static/assets/
        echo "Example assets copied to volume."
    else
        echo "No example assets found in /usr/src/app/initial-static/assets"
    fi
fi

# Check if the email templates directory exists
if [ ! -d "/usr/src/app/static/email/templates" ]; then
    echo "Creating email templates directory on volume..."
    mkdir -p /usr/src/app/static/email/templates
    
    # Copy email templates if they exist
    if [ -d "/usr/src/app/initial-static/email/templates" ]; then
        cp -r /usr/src/app/initial-static/email/templates/* /usr/src/app/static/email/templates/
        echo "Email templates copied to volume."
    fi
fi

echo "Volume initialization completed."
