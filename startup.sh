#!/bin/bash

# Azure App Service startup script for Spring Boot application
echo "=== Azure App Service Startup Script ==="
echo "Java version: $(java -version 2>&1 | head -1)"
echo "Working directory: $(pwd)"
echo "Available files: $(ls -la)"

# Set Java options for Azure deployment
export JAVA_OPTS="-Dspring.profiles.active=azure -Dserver.port=${PORT:-8080} -Xmx512m -Xms256m"

# Find the JAR file in multiple possible locations
JAR_FILE=""
if [ -f "/home/site/wwwroot/*.jar" ]; then
    JAR_FILE=$(find /home/site/wwwroot -name "*.jar" | head -1)
elif [ -f "target/*.jar" ]; then
    JAR_FILE=$(find target -name "*.jar" | head -1)
elif [ -f "*.jar" ]; then
    JAR_FILE=$(find . -maxdepth 1 -name "*.jar" | head -1)
else
    JAR_FILE=$(find . -name "*.jar" | head -1)
fi

if [ -z "$JAR_FILE" ]; then
    echo "ERROR: No JAR file found"
    echo "Available files in current directory:"
    ls -la
    echo "Available files in target directory:"
    ls -la target/ 2>/dev/null || echo "No target directory found"
    exit 1
fi

echo "Found JAR file: $JAR_FILE"
echo "Starting application with:"
echo "  Java Options: $JAVA_OPTS"
echo "  Active Profile: azure"
echo "  Server Port: ${PORT:-8080}"

# Start the application
exec java $JAVA_OPTS -jar "$JAR_FILE" 