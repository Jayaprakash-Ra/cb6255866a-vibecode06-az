# Smart Bin Tracker - Java Spring Boot Version

A comprehensive waste management tracking system built with **Java Spring Boot** and integrated with **Azure Storage Account** for cloud deployment.

## 🌟 Features

### Core Functionality
- **📍 Waste Collection Reporting** - Citizens can report waste collection issues with photos
- **📊 Dashboard Analytics** - Real-time statistics and reporting metrics
- **📅 Collection Schedule** - Track and manage waste collection schedules
- **🎓 Education Center** - Environmental awareness and recycling education
- **🏆 Rewards System** - Gamification with points and rewards for community participation
- **👨‍💼 Admin Panel** - Administrative controls for incident resolution

### Azure Integration
- **☁️ Azure Storage Account** - File upload and management for report images
- **🔧 Azure App Service** - Cloud hosting and deployment
- **🗄️ Database Support** - H2 (development) and SQL Server (production)
- **🔐 Security** - JWT-based authentication with Spring Security

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.0
- **Frontend**: Thymeleaf, Bootstrap 5, Font Awesome
- **Database**: H2 (dev), Microsoft SQL Server (prod)
- **Cloud**: Azure App Service, Azure Storage Account
- **Security**: Spring Security, JWT
- **Build Tool**: Maven
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Azure CLI (for deployment)
- Azure Storage Account
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/smart-bin-tracker-java.git
   cd smart-bin-tracker-java
   ```

2. **Configure application properties**
   ```bash
   cp src/main/resources/application.yml.example src/main/resources/application.yml
   ```

3. **Set up Azure Storage (Optional for local development)**
   ```yaml
   spring:
     cloud:
       azure:
         storage:
           blob:
             account-name: your-storage-account
             account-key: your-storage-key
             container-name: smartbin-files
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - Main application: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
   - Health check: http://localhost:8080/actuator/health

## ☁️ Azure Deployment

### Azure App Service Deployment

#### Method 1: Azure CLI (Recommended)

1. **Build the application**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Deploy using Azure Maven Plugin**
   ```bash
   # Configure Azure credentials
   az login
   
   # Set environment variables
   export AZURE_SUBSCRIPTION_ID="your-subscription-id"
   export AZURE_RESOURCE_GROUP="your-resource-group"
   export AZURE_APP_NAME="your-app-name"
   
   # Deploy to Azure
   mvn azure-webapp:deploy
   ```

#### Method 2: GitHub Actions (Automated)

1. **Set up GitHub Secrets**
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure portal

2. **Push to main branch**
   ```bash
   git push origin main
   ```

3. **Monitor deployment**
   - Check GitHub Actions tab for deployment status

### Azure Storage Account Setup

1. **Create Storage Account**
   ```bash
   az storage account create \
     --name smartbinstorageaccount \
     --resource-group your-resource-group \
     --location eastus \
     --sku Standard_LRS
   ```

2. **Get connection details**
   ```bash
   az storage account show-connection-string \
     --name smartbinstorageaccount \
     --resource-group your-resource-group
   ```

3. **Configure App Service Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group your-resource-group \
     --name your-app-name \
     --settings \
     AZURE_STORAGE_ACCOUNT_NAME="smartbinstorageaccount" \
     AZURE_STORAGE_ACCOUNT_KEY="your-storage-key" \
     AZURE_STORAGE_CONTAINER="smartbin-files"
   ```

## 📱 API Endpoints

### Public Endpoints
```
GET  /                          - Redirect to dashboard
GET  /dashboard                 - Main dashboard
GET  /reports                   - Report submission page
GET  /schedule                  - Collection schedule
GET  /education                 - Education center
GET  /rewards                   - Rewards center
```

### API Endpoints
```
POST /api/reports               - Create new report
GET  /api/reports               - Get all reports (paginated)
GET  /api/reports/{id}          - Get specific report
GET  /api/reports/status/{status} - Get reports by status
PUT  /api/reports/{id}/status   - Update report status (Admin)
DELETE /api/reports/{id}        - Delete report (Admin)
```

### Admin Endpoints
```
GET  /admin                     - Admin dashboard
POST /api/auth/admin/login      - Admin authentication
GET  /api/admin/incidents       - Get incident reports
PUT  /api/admin/incidents/{id}  - Resolve incidents
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection URL | `jdbc:h2:mem:testdb` |
| `DATABASE_USERNAME` | Database username | `sa` |
| `DATABASE_PASSWORD` | Database password | `` |
| `AZURE_STORAGE_ACCOUNT_NAME` | Azure storage account name | `` |
| `AZURE_STORAGE_ACCOUNT_KEY` | Azure storage account key | `` |
| `AZURE_STORAGE_CONTAINER` | Storage container name | `smartbin-files` |
| `JWT_SECRET` | JWT signing secret | Auto-generated |
| `ADMIN_USERNAME` | Default admin username | `admin` |
| `ADMIN_PASSWORD` | Default admin password | `admin123` |

### Profiles

- **default**: H2 database, local development
- **azure**: SQL Server database, Azure deployment

## 📊 Deployment Performance

### Expected Deployment Times on Azure:

| Deployment Method | Time Estimate | JAR Size |
|-------------------|---------------|----------|
| 🚀 **Maven Azure Plugin** | **2-3 minutes** | ~50-80 MB |
| 🔄 **GitHub Actions CI/CD** | **4-6 minutes** | ~50-80 MB |
| 📁 **Manual JAR Upload** | **1-2 minutes** | ~50-80 MB |

### Performance Optimizations:
- ✅ Fat JAR deployment (single file)
- ✅ Azure Storage for static files
- ✅ Connection pooling
- ✅ Caching enabled
- ✅ Gzip compression

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - User and Admin roles
- **Azure Storage Security** - Secure file upload and access
- **Input Validation** - Comprehensive request validation
- **CORS Configuration** - Cross-origin resource sharing
- **HTTPS Enforcement** - Secure communication

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run integration tests
mvn verify -P integration-tests
```

## 📝 API Documentation

Visit `/swagger-ui.html` when the application is running for interactive API documentation.

## 🐛 Troubleshooting

### Common Issues

1. **Azure Storage Connection Issues**
   ```bash
   # Check storage account access
   az storage account check-name --name your-storage-account
   ```

2. **Database Connection Issues**
   ```bash
   # Verify SQL Server connection
   telnet your-sql-server.database.windows.net 1433
   ```

3. **Memory Issues on Azure**
   ```bash
   # Increase App Service plan
   az appservice plan update --name your-plan --resource-group your-rg --sku B2
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Azure team for cloud services
- Bootstrap for UI components
- Font Awesome for icons

---

## 📞 Support

For support and questions:
- 📧 Email: support@smartbintracker.com
- 📚 Documentation: [docs.smartbintracker.com](https://docs.smartbintracker.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/smart-bin-tracker-java/issues)

---

**🌱 Making communities cleaner, one report at a time!** 