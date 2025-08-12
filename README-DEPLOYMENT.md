# Azure Deployment Guide for Smart Bin Project

## Overview
This guide will help you deploy your Smart Bin application to Azure App Service at:
**https://cts-vibeappuk6411-1.azurewebsites.net/**

## Prerequisites
- GitHub repository: `cb6255866a-vibecode06-az`
- Azure App Service: `cts-vibeappuk6411-1`
- Java 21 (matches Azure environment)

## Deployment Methods

### Method 1: GitHub Actions (Recommended)

#### Step 1: Get Azure Publish Profile
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service: `cts-vibeappuk6411-1`
3. Click **"Get publish profile"** button
4. Download the `.PublishSettings` file
5. Copy the entire content of this file

#### Step 2: Configure GitHub Secrets
1. Go to your GitHub repository: `cb6255866a-vibecode06-az`
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire content from the publish profile file
6. Click **"Add secret"**

#### Step 3: Push Code to Trigger Deployment
```bash
git add .
git commit -m "Deploy Smart Bin application to Azure"
git push origin main
```

The GitHub Actions workflow will automatically:
- Build the Java application using Maven wrapper
- Create a JAR file
- Deploy to Azure App Service

### Method 2: Azure Deployment Center

#### Step 1: Connect GitHub Repository
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service: `cts-vibeappuk6411-1`
3. Go to **Deployment** → **Deployment Center**
4. Select **GitHub** as source
5. Authorize Azure to access your GitHub account
6. Select:
   - Organization: Your GitHub username
   - Repository: `cb6255866a-vibecode06-az`
   - Branch: `main` or `master`

#### Step 2: Configure Build Settings
1. **Build Provider**: GitHub Actions
2. **Runtime stack**: Java 21
3. **Java web server stack**: Java SE (Embedded Web Server)
4. Click **Save**

#### Step 3: Configure Application Settings
In your Azure App Service, go to **Configuration** → **Application settings** and add:

```
JAVA_OPTS = -Dspring.profiles.active=azure -Dserver.port=%HTTP_PLATFORM_PORT%
WEBSITES_ENABLE_APP_SERVICE_STORAGE = true
SCM_DO_BUILD_DURING_DEPLOYMENT = true
WEBSITE_RUN_FROM_PACKAGE = 0
```

#### Step 4: Set Startup Command
In **Configuration** → **General settings**:
- **Startup Command**: `java -Dspring.profiles.active=azure -Dserver.port=%HTTP_PLATFORM_PORT% -jar /home/site/wwwroot/*.jar`

### Method 3: Manual Deployment via Azure CLI

#### Prerequisites
- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Login: `az login`

#### Build and Deploy
```bash
# Build the application
./mvnw clean package -DskipTests

# Deploy to Azure
az webapp deploy --resource-group <your-resource-group> --name cts-vibeappuk6411-1 --src-path target/smart-bin-tracker-1.0.0.jar --type jar
```

## Environment Variables (Optional)

For production deployment, consider setting these environment variables in Azure:

```
# Database Configuration (if using Azure SQL)
DATABASE_URL = <your-azure-sql-connection-string>
DATABASE_USERNAME = <your-db-username>
DATABASE_PASSWORD = <your-db-password>
DATABASE_DRIVER = com.microsoft.sqlserver.jdbc.SQLServerDriver
DATABASE_DIALECT = org.hibernate.dialect.SQLServerDialect

# Security
JWT_SECRET = <your-secure-jwt-secret>
ADMIN_USERNAME = <your-admin-username>
ADMIN_PASSWORD = <your-secure-admin-password>

# Azure Storage (if using blob storage)
AZURE_STORAGE_ACCOUNT_NAME = <your-storage-account>
AZURE_STORAGE_ACCOUNT_KEY = <your-storage-key>
AZURE_STORAGE_CONTAINER = smartbin-files
```

## Testing Deployment

After deployment, test these endpoints:

1. **Main Application**: https://cts-vibeappuk6411-1.azurewebsites.net/
2. **Health Check**: https://cts-vibeappuk6411-1.azurewebsites.net/actuator/health
3. **Dashboard**: https://cts-vibeappuk6411-1.azurewebsites.net/dashboard
4. **Admin Login**: https://cts-vibeappuk6411-1.azurewebsites.net/admin/login

## Troubleshooting

### Common Issues

1. **"Application failed to start"**
   - Check Java version compatibility (should be Java 21)
   - Verify startup command is correct
   - Check application logs in Azure portal

2. **"No JAR file found"**
   - Ensure Maven build completed successfully
   - Check that target directory contains the JAR file
   - Verify deployment artifacts were uploaded

3. **Database connection errors**
   - Verify database connection string
   - Check firewall rules for Azure SQL
   - Ensure credentials are correct

### View Logs
1. Go to Azure Portal → App Service → Log stream
2. Or download logs: **Monitoring** → **Log stream**

## File Structure

Your repository should have these key files:
```
├── .deployment                 # Azure deployment config
├── .mvn/wrapper/              # Maven wrapper
├── azure-deploy.yml           # GitHub Actions workflow
├── deploy.sh                  # Custom deployment script
├── mvnw / mvnw.cmd           # Maven wrapper executables
├── pom.xml                   # Maven configuration
├── startup.sh                # Application startup script
└── src/                      # Application source code
```

## Success Criteria

Your deployment is successful when:
1. ✅ https://cts-vibeappuk6411-1.azurewebsites.net/ shows your Smart Bin application (not the default Java page)
2. ✅ Health endpoint returns status "UP"
3. ✅ You can access the dashboard and admin features
4. ✅ Application logs show successful startup

---

**Repository**: `cb6255866a-vibecode06-az`  
**Azure App Service**: `cts-vibeappuk6411-1`  
**URL**: https://cts-vibeappuk6411-1.azurewebsites.net/ 