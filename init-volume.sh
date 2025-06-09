#!/bin/bash
# This script initializes the static assets volume on first run

echo "==== DEBUGGING INFORMATION ===="
echo "Current directory: $(pwd)"
echo "Listing /usr/src/app directory:"
ls -la /usr/src/app

echo "\nListing /usr/src/app/static directory (if exists):"
ls -la /usr/src/app/static 2>/dev/null || echo "Static directory doesn't exist or is empty"

echo "\nListing /usr/src/app/initial-static directory (if exists):"
ls -la /usr/src/app/initial-static 2>/dev/null || echo "Initial-static directory doesn't exist or is empty"

echo "\n==== CREATING DIRECTORY STRUCTURE ===="
# Create all required directories with verbose output
echo "Creating directory structure..."
mkdir -p /usr/src/app/static/assets
mkdir -p /usr/src/app/static/email/templates/partials

echo "\n==== CREATING EMAIL TEMPLATES ===="
# Create email template files directly
echo "Creating email template files..."

# Create header.hbs
cat > /usr/src/app/static/email/templates/partials/header.hbs << 'EOL'
<!--suppress ALL -->
<mjml>
    <mj-head>
        <mj-title>{{ title }}</mj-title>
        <mj-attributes>
            <mj-all font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"></mj-all>
        </mj-attributes>
    </mj-head>
    <mj-body>
        <mj-section background-color="#f0f0f0" padding="10px 0">
            <mj-column>
                <mj-text align="center" font-size="20px" font-weight="bold" padding="10px">
                    {{ shopName }}
                </mj-text>
            </mj-column>
        </mj-section>
EOL
echo "Created header.hbs"

# Create footer.hbs
cat > /usr/src/app/static/email/templates/partials/footer.hbs << 'EOL'
<!--suppress ALL -->
<mj-section background-color="#375a67">
    <mj-column width="100%">
        <mj-text align="center" color="#eee">
            <span>[footer text]</span>
        </mj-text>
    </mj-column>
</mj-section>
</mj-body>
</mjml>
EOL
echo "Created footer.hbs"

# Copy any other static files if they exist
echo "\n==== COPYING OTHER STATIC FILES ===="
if [ -d "/usr/src/app/initial-static" ]; then
    echo "Copying files from initial-static to static..."
    cp -rv /usr/src/app/initial-static/* /usr/src/app/static/ 2>/dev/null || echo "No files to copy or error occurred"
fi

echo "\n==== FINAL DIRECTORY STRUCTURE ===="
find /usr/src/app/static -type f | sort

echo "\n==== CHECKING EMAIL TEMPLATES ===="
ls -la /usr/src/app/static/email/templates/partials/

echo "\n==== VOLUME INITIALIZATION COMPLETED ===="

# Start the application
exec node dist/index.js
