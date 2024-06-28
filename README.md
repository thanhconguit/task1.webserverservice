# Introduction
This web application includes features such as Login, User Management, Role Management, and Event Notification.

# Web Server Service - BACKEND
## 1. Project Structure

The project structure is designed to promote separation of concerns and modularity, making it easier to understand, test, and maintain the application.
```
├── WebServerService.Api
│   ├── Api                  # Contains the API, including controllers, middleware, etc.
│   ├── Data                 # Contains infrastructure concerns such as data tables, communication with the database, etc.
│   ├── Domain               # Contains base models, enums, utility methods, extensions, etc.
│   └── Service              # Contains the core business logic, domain models, view models, etc.
```
## 2. Build Locally
To use this project template, follow the steps below:

Ensure the .NET 6 SDK is installed on your machine.
Open the solution in your preferred IDE (e.g., Visual Studio, Visual Studio Code).
Build the solution to restore NuGet packages and compile the code.
Set the .Api project as the startup project and run it.
# Web Server Service - Frontend

## 1. Project Structure
The project structure is designed to promote separation of concerns and modularity, making it easier to understand, test, and maintain the application.
```
├── WebServerService.Ui.src
│   ├── components                  # Contains components for user, role, and event management, as well as the header for handling new incoming events.
│   ├── services                    # Contains services for communication with the backend.
│   ├── others                      # Contains base models, utility methods, extensions, etc.
```

# TCP Client - A Console App to Create Random Events and Send to Web Server Service

## 1. Project Structure
```

├── TCPClient
│   ├── EventPublisher               # Contains logic to connect to the server and send events.
│   ├── Generator                    # Generates random events.
│   ├── TCPClient                    # Sets up dependency injection and configuration.
```

## 2. Build Locally
Set TCPClient as the startup project and run it.

# Security Points
The Web Server Service includes authentication and authorization. Configure a whitelist of IP addresses to block requests from unauthorized clients.