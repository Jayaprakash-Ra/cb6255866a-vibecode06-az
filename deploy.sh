#!/bin/bash

# ----------------------
# KUDU Deployment Script for Java Spring Boot
# Version: 1.0.0
# ----------------------

# Helpers
# -------

exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "An error has occurred during web site deployment."
    echo $1
    exit 1
  fi
}

# Prerequisites
# -------------

# Verify node.js installed
hash mvn 2>/dev/null
exitWithMessageOnError "Missing Maven. Please ensure Maven is installed."

# Setup
# -----

SCRIPT_DIR="${BASH_SOURCE[0]%\\*}"
SCRIPT_DIR="${SCRIPT_DIR%/*}"
ARTIFACTS=$SCRIPT_DIR/../artifacts
KUDU_SYNC_CMD=${KUDU_SYNC_CMD//\"}

if [[ ! -n "$DEPLOYMENT_SOURCE" ]]; then
  DEPLOYMENT_SOURCE=$SCRIPT_DIR
fi

if [[ ! -n "$NEXT_MANIFEST_PATH" ]]; then
  NEXT_MANIFEST_PATH=$ARTIFACTS/manifest

  if [[ ! -n "$PREVIOUS_MANIFEST_PATH" ]]; then
    PREVIOUS_MANIFEST_PATH=$NEXT_MANIFEST_PATH
  fi
fi

if [[ ! -n "$DEPLOYMENT_TARGET" ]]; then
  DEPLOYMENT_TARGET=$ARTIFACTS/wwwroot
else
  KUDU_SERVICE=true
fi

if [[ ! -n "$KUDU_SYNC_CMD" ]]; then
  # Install kudu sync
  echo Installing Kudu Sync
  npm install kudusync -g --silent
  exitWithMessageOnError "npm failed"

  if [[ ! -n "$KUDU_SERVICE" ]]; then
    # In case we are running locally this is the correct location of kuduSync
    KUDU_SYNC_CMD=kuduSync
  else
    # In case we are running on kudu service this is the correct location of kuduSync
    KUDU_SYNC_CMD=$APPDATA/npm/kuduSync.cmd
  fi
fi

# Deployment
# ----------

echo Handling Java Web App deployment.

# 1. Build Java application
cd "$DEPLOYMENT_SOURCE"
echo "Building Java application..."
./mvnw clean package -DskipTests
exitWithMessageOnError "Maven build failed"

# 2. Copy jar file to deployment target
echo "Copying JAR file to deployment target..."
mkdir -p "$DEPLOYMENT_TARGET"
cp target/*.jar "$DEPLOYMENT_TARGET/"
exitWithMessageOnError "Failed to copy JAR file"

# 3. Copy additional files
cp startup.sh "$DEPLOYMENT_TARGET/" 2>/dev/null || echo "No startup.sh found"

echo "Finished successfully." 