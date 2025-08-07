# Playwright Test Automation Framework v1.0

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=for-the-badge&logo=Cucumber&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![BrowserStack](https://img.shields.io/badge/BrowserStack-FF6600?style=for-the-badge&logo=BrowserStack&logoColor=white)

**Production-ready E2E test automation framework** built with Playwright v1.52.0 and Cucumber.js, featuring comprehensive API testing, UI automation, and BrowserStack cloud testing integration.

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwright_js

# Install dependencies
npm install

# Install Playwright browsers
npm run setup

# Verify installation
npm run health
```

### Run Your First Test

```bash
# Run local UI tests (headless)
npm run test:local

# Run API tests
npm run test:api

# Run with visible browser
HEADLESS=false npm run test:local

# Run BrowserStack tests
npm run bs:win
```

> **For detailed setup and examples**, see [QUICKSTART.md](./QUICKSTART.md)

## Table of Contents

- [ Features](#-features)
- [ Architecture](#️-architecture)
- [ Testing Capabilities](#-testing-capabilities)
- [ Usage Guide](#-usage-guide)
- [ Complete Step Definitions Reference](#-complete-step-definitions-reference)
- [ Configuration](#-configuration)
- [ Reporting](#-reporting)
- [ Cross-Platform Testing](#-cross-platform-testing)
- [ Development](#️-development)
- [ Framework Roadmap](#️-framework-roadmap)
- [ Configuration](#-configuration)
- [ Reporting](#-reporting)
- [ Cross-Platform Testing](#-cross-platform-testing)
- [ Development](#️-development)

## ✨ Features

### 🚀 Core Capabilities (Production Ready)

- **✅ Playwright v1.52.0** - Latest stable automation with full browser support
- **✅ Cucumber BDD** - Behavior-driven development with Gherkin syntax  
- **✅ BrowserStack Integration** - Cloud testing across Windows, macOS, iOS, Android
- **✅ Cross-Browser Testing** - Chrome, Firefox, Safari, Edge support
- **✅ Parallel Execution** - Multi-threaded test execution for faster results

### 🧪 Testing Capabilities (Available Now)

- **✅ API Testing** - Native Playwright API request context for HTTP testing
- **✅ UI Automation** - Full browser automation with smart selectors
- **✅ E2E Testing** - End-to-end workflow testing with real user scenarios
- **✅ Database Testing** - MySQL database integration and validation
- **✅ File Operations** - Excel, CSV, JSON data handling

### 🛠️ Framework Features (Production Ready)

- **✅ Multi-Environment Support** - DEV, TEST, STAGING, PRODUCTION configurations
- **✅ Smart Error Handling** - Retry mechanisms and detailed error reporting
- **✅ Comprehensive Logging** - Winston-based structured logging system
- **✅ Code Quality** - ESLint, Prettier, and Git hooks for code standards
- **✅ Rich Reporting** - Allure reports with screenshots and test insights

### 🔮 Planned Enhancements

- **📱 Mobile Testing** (v2.0) - Native mobile app testing capabilities
- **⚡ Performance Testing** (v2.0) - Web Vitals and Lighthouse integration  
- **👁️ Visual Testing** (v2.1) - Screenshot comparison and visual regression
- **🐳 Docker Integration** (v2.0) - Containerized test execution
- **📊 Advanced Analytics** (v2.1) - Enhanced reporting and test insights

## Architecture

```
playwright_js/
├── src/
│   ├── utils/                    # Core utilities
│   │   ├── PlaywrightApiMockUtils.js  # API testing & mocking
│   │   ├── BrowserUtils.js       # Browser management
│   │   ├── DatabaseUtils.js      # Database operations
│   │   └── logger.js             # Logging system
│   └── pages/                    # Page Object Models
├── tests/
│   ├── features/                 # Gherkin feature files
│   │   ├── api/                 # API test scenarios
│   │   ├── ui/                  # UI test scenarios
│   │   └── e2e/                 # E2E test scenarios
│   ├── step-definitions/         # Cucumber step implementations
│   │   ├── api/                 # API step definitions
│   │   ├── ui/                  # UI step definitions
│   │   └── playwright-api/      # Playwright API steps
│   └── support/                  # Test support files
├── test-data/                    # Test data files
│   ├── mockdata/                # API mock responses
│   ├── schemas/                 # JSON schemas
│   └── testdata/                # Test datasets
├── config/                       # Environment configurations
└── reports/                      # Test reports and artifacts
```

## Testing Capabilities

### API Testing with Playwright

The framework uses **Playwright's native API request context** for fast, reliable API testing:

```gherkin
# Playwright API Testing Example
Given I setup Playwright API context with base URL "https://api.example.com"
When I make a Playwright API "GET" request to "/users/1"
Then the Playwright API response status should be 200
And the Playwright API response should contain field "data.email"
```

**Key Features:**

- ✅ Native HTTP request handling without browser overhead
- ✅ Built-in response validation and JSON parsing
- ✅ Automatic request/response logging
- ✅ JSON schema validation
- ✅ Custom headers and authentication support
- ✅ File upload/download capabilities

### API Mocking & Interception

Built-in API mocking using Playwright's route interception:

```gherkin
# API Mocking Example
Given I mock the API "GET" "**/api/users/123" with response:
"""
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
"""
When I make a request to the mocked endpoint
Then the mock should be called with the expected data
```

**Mock Features:**

- URL pattern matching with wildcards
- Response loading from JSON files
- ⏱Configurable response delays
- Call count verification
- Mock statistics and debugging

### UI Automation

Comprehensive browser automation with Playwright:

```gherkin
# UI Testing Example
Given I navigate to the application
When I click on the login button
And I enter valid credentials
Then I should be logged in successfully
```

### E2E Testing

Full end-to-end workflow testing:

```gherkin
# E2E Testing Example
Scenario: Complete user registration flow
  Given I start the registration process
  When I complete all registration steps
  And I verify my email
  Then I should have full access to the application
```

## 🚀 Usage Guide

### Running Tests

#### Local Testing

```bash
# Default test (headless UI tests)
npm run test

# Specific test types
npm run test:local    # UI tests (headless)
npm run test:api      # API tests only
npm run test:ui       # UI tests with Chrome
npm run test:e2e      # End-to-end tests
npm run test:smoke    # Smoke tests

# Run with visible browser
HEADLESS=false npm run test:local
```

#### BrowserStack Cloud Testing

```bash
# Cross-platform testing
npm run bs:win        # Windows Chrome
npm run bs:mac        # macOS Safari  
npm run bs:ios        # iOS Safari
npm run bs:android    # Android Chrome
```

#### Development & Debugging

```bash
# Quick development run (with browser visible)
npm run dev

# Code quality checks
npm run lint          # Fix linting issues
npm run format        # Format code
npm run validate      # Check code quality
```

#### Utilities

```bash
# Project maintenance
npm run clean         # Clean reports
npm run setup         # Install browsers
npm run health        # Health check
npm run status        # Framework status

# Reporting
npm run report        # Generate & open Allure report
```

### Writing Tests

#### API Test Example

```gherkin
Feature: User API Testing
  As a developer
  I want to test user API endpoints
  So that I can ensure they work correctly

  @playwright-api-working
  Scenario: Get user profile
    Given I setup Playwright API context with base URL "https://api.example.com"
    When I make a Playwright API "GET" request to "/users/profile"
    Then the Playwright API response status should be 200
    And the Playwright API response should contain field "user.email"
```

#### UI Test Example

```gherkin
Feature: Login Functionality
  As a user
  I want to login to the application
  So that I can access my account

  @ui
  Scenario: Successful login
    Given I navigate to the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
```

## 🔧 Configuration

### Environment Configuration

```javascript
// config/test.json
{
  "api": {
    "baseURL": "https://api.test.example.com",
    "timeout": 30000,
    "retries": 3
  },
  "ui": {
    "baseURL": "https://test.example.com",
    "viewport": { "width": 1920, "height": 1080 }
  }
}
```

### Playwright Configuration

```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
};
```

### Environment Variables

```bash
# Test execution
NODE_ENV=test|dev|staging|production
HEADLESS=true|false
PARALLEL_THREAD=1-10

# Browser selection
BROWSER=chromium|firefox|webkit

# Cloud testing
CLOUD_PROVIDER=browserstack
BROWSERSTACK_USERNAME=username
BROWSERSTACK_ACCESS_KEY=key

# Reporting
ALLURE_RESULTS_DIR=reports/allure/results
RECORD_VIDEO=true|false
```

## Reporting

The framework generates comprehensive test reports:

### Allure Reports (Default)

```bash
# Generate and open Allure report
npm run report

# Generate report only
npm run allure:generate

# Open existing report
npm run allure:open
```

### Cucumber HTML Reports

```bash
# Reports are automatically generated in reports/cucumber/
npm run test:api  # Generates API test report
npm run test:ui   # Generates UI test report
```

### Report Structure

```
reports/
├── allure/
│   ├── results/          # Raw test results
│   └── html/            # Generated HTML report
├── cucumber/            # Cucumber HTML reports
├── playwright/          # Playwright traces and videos
└── screenshots/         # Test screenshots
```

## Cross-Platform Testing

### Browser Support (v1.0 - Available Now)

- ✅ **Chromium** - Latest Chrome/Edge
- ✅ **Firefox** - Latest Firefox
- ✅ **WebKit** - Latest Safari

### Desktop Testing Matrix (v1.0 - Current Support)

| OS            | Browser                 | Version | Status       |
| ------------- | ----------------------- | ------- | ------------ |
| Windows 10/11 | Chrome, Firefox, Edge   | Latest  | ✅ Available |
| macOS         | Chrome, Firefox, Safari | Latest  | ✅ Available |
| Linux         | Chrome, Firefox         | Latest  | ✅ Available |

### 🚀 Future Testing Capabilities

#### Mobile Testing (Coming in v2.0)

```bash
# Android testing (Planned for v2.0)
npm run bs:mobile:android

# iOS testing (Planned for v2.0)
npm run bs:mobile:ios
```

#### Performance Testing (Coming in v2.0)

```bash
# Web Vitals testing (Planned for v2.0)
npm run test:performance

# Lighthouse integration (Planned for v2.0)
npm run test:lighthouse
```

#### Enhanced Cloud Testing Matrix (Planned for v2.0)

| OS            | Browser                 | Version | Mobile | Status          |
| ------------- | ----------------------- | ------- | ------ | --------------- |
| Windows 10/11 | Chrome, Firefox, Edge   | Latest  | ❌     | ✅ Available    |
| macOS         | Chrome, Firefox, Safari | Latest  | ❌     | ✅ Available    |
| Android       | Chrome                  | Latest  | ✅     | 🚀 Planned v2.0 |
| iOS           | Safari                  | Latest  | ✅     | 🚀 Planned v2.0 |

## 🛠️ Development

### Adding New Tests

1. Create feature file in `tests/features/`
2. Add step definitions in `tests/step-definitions/`
3. Update page objects if needed
4. Run tests: `npm run test:your-tag`

### Custom Utilities

```javascript
// src/utils/CustomUtils.js
class CustomUtils {
  async customMethod() {
    // Your custom logic
  }
}

module.exports = { CustomUtils };
```

### Available NPM Scripts (v1.0)

```bash
# Development
npm run health              # Health check
npm run install:browsers    # Install Playwright browsers

# Testing (Available Now)
npm run test:api           # API tests
npm run test:ui            # UI tests
npm run test:e2e           # E2E tests
npm run test:smoke         # Smoke tests

# Quick tests (faster execution)
npm run test:playwright-api:quick
npm run test:ui:quick
npm run test:smoke:quick

# Browser-specific (Available Now)
npm run test:chrome
npm run test:firefox
npm run test:webkit

# BrowserStack Cloud Testing (Available Now)
npm run bs:api
npm run bs:ui
npm run bs:crossbrowser

# Reporting (Available Now)
npm run report             # Generate and open Allure report
npm run allure:generate    # Generate Allure report
npm run allure:open        # Open Allure report
npm run reports:clean      # Clean all reports
```

### Future NPM Scripts (Coming in v2.0)

```bash
# Mobile testing (Planned for v2.0)
npm run bs:mobile:android   # Android device testing
npm run bs:mobile:ios       # iOS device testing

# Performance testing (Planned for v2.0)
npm run test:performance    # Web Vitals testing
npm run test:lighthouse     # Lighthouse performance audit

# Visual testing (Planned for v2.1)
npm run test:visual         # Visual regression testing
npm run test:screenshots    # Screenshot comparison
```

## Complete Step Definitions Reference

### Playwright API Testing Steps (v1.0 - Recommended)

#### Setup & Request Execution

```gherkin
# Context setup
Given I setup Playwright API context with base URL "https://api.example.com"

# Simple requests
When I make a Playwright API "GET" request to "/users"
When I make a Playwright API "POST" request to "/users"

# Requests with JSON data
When I make a Playwright API "POST" request to "/users" with data:
  """
  {"name": "John", "email": "john@example.com"}
  """

# Requests with custom headers
When I make a Playwright API "GET" request to "/users" with headers:
  """
  {"Authorization": "Bearer token123"}
  """

# Requests with query parameters
When I make a Playwright API "GET" request to "/users" with params:
  """
  {"page": "1", "limit": "10"}
  """
```

#### Response Validation

```gherkin
# Status validation
Then the Playwright API response status should be 200

# Field validation
Then the Playwright API response should contain field "data.id"
Then the Playwright API response field "data.name" should be "John Doe"

# Schema validation
Then the Playwright API response should match schema "user-schema.json"

# Debugging
When I print Playwright API request log
```

### UI Testing Steps (v1.0 - Available)

#### Browser Navigation

```gherkin
# Page navigation
Given I navigate to application "LoginPage"
Given I navigate to "MyApp" application from environment
Given I navigate forward on the browser
Given I navigate back on the browser
Given I refresh the browser

# URL validation
Then I verify the current URL contains "dashboard"
Then I verify the current page title is "Welcome"
```

#### Element Interactions

```gherkin
# Clicking
Given I click on "Login Button" from "LoginPage"
Given I double click the "Item" on the "ProductPage"

# Text input
Given I enter value "john@example.com" in field "Email Field" on "LoginPage"
Given I clear the text "Username Field" on the "LoginPage"

# Keyboard actions
Given I press the "Enter" key into the "Search Field" on the "HomePage"
When I press "Ctrl+A" keyboard combination
```

#### Form Elements

```gherkin
# Dropdowns
When I select "Premium" from dropdown "Subscription Type" on "PaymentPage"

# Checkboxes
When I check the checkbox "Terms and Conditions" on "RegistrationPage"
When I uncheck the checkbox "Newsletter" on "ProfilePage"

# File uploads
When I upload file "document.pdf" to "File Upload" on "DocumentPage"
```

#### Validations

```gherkin
# Visibility
Then I verify that the field "Success Message" should be visible on the "HomePage"
Then I verify that the field "Error Panel" should be invisible on the "LoginPage"

# State validation
Then I verify that the field "Submit Button" should be enabled on the "ContactPage"
Then I verify that the field "Edit Button" should be disabled on the "ProfilePage"

# Content validation
Then I verify the text "Welcome back!" is displayed on "DashboardPage"
Then I verify field "User Name" contains "John Doe" on "ProfilePage"
```

#### Advanced UI Operations

```gherkin
# Scrolling
When I scroll to "Footer" on "HomePage"
When I scroll up on the page

# Drag and drop
When I drag "Item A" and drop to "Drop Zone" on "KanbanPage"

# Frames and windows
When I switch to iframe "payment-frame"
When I switch back to main content

# Alerts
When I accept the browser alert
When I dismiss the browser alert

# Waiting
When I wait for 5 seconds
When I wait for element "Loading Spinner" to disappear on "ProcessingPage"
```

### Database Testing Steps (v1.0 - Available)

#### Database Operations

```gherkin
# Connection and queries
Given I connect to the database
When I execute the query "SELECT * FROM users WHERE id = 1"

# Stored procedures
When I execute stored procedure "sp_get_user_details" with parameters:
  | parameter | value  |
  | user_id   | 123    |
  | status    | active |

# Result validation
Then I validate the database result count is 1
Then I validate database field "username" value "john_doe"
```

#### Data Reconciliation

```gherkin
# CSV to Database validation
Given I read CSV file "users.csv"
When I verify all record of csv feed file to db:
  | csvFile   | dbTable | keyColumn |
  | users.csv | users   | user_id   |

# Statistical validation
When Verify avg value of a specific column with csv feed:
  | csvFile   | dbTable | column |
  | sales.csv | sales   | amount |
```

### Legacy API Testing Steps (v1.0 - Available)

#### Request Setup

```gherkin
Given I read the JSON file "user-data.json"
Given I initiate api request on "https://api.example.com"
Given I set the endpoint to "users"
Given I set the headers:
  | key           | value            |
  | Authorization | Bearer token123  |
  | Content-Type  | application/json |

Given I set the query string:
  | key   | value |
  | page  | 1     |
  | limit | 10    |
```

#### Request Execution & Validation

```gherkin
When I hit the "GET" request
Then I validate the status code as "200"
Then the response should match schema "user-schema.json"
Then the field "data.name" should be "John Doe"
Then the size of "users" should be 10
```

### File and Excel Operations (v1.0 - Available)

```gherkin
Given I have a excel file "test-data.xlsx"
When I read the data from excel
```

### Browser Controls (v1.0 - Available)

```gherkin
When I zoom in the browser
When I zoom out the browser
When I print the current page
When I save page as PDF "report.pdf"
```

### **Step Definition Usage Guidelines:**

1. **Recommended Approach**: Use Playwright API steps for API testing (faster, more reliable)
2. **Page Objects**: Replace `"PageName"` with your actual page object class names
3. **Element Names**: Use descriptive element names that match your page object definitions
4. **Data Tables**: Use data tables for complex test data and multiple field validation
5. **File Paths**: All file paths are relative to `test-data/` directory
6. **Schema Files**: Place JSON schema files in `test-data/schemas/` directory

### **Step Definition Organization:**

```
tests/step-definitions/
├── playwright-api/          # Playwright native API steps (Recommended)
├── api/                     # Legacy API steps
├── ui/                      # All UI interaction steps
│   ├── prebuilt-browser-steps.js    # Navigation, URL operations
│   ├── prebuilt-click-steps.js      # Click interactions
│   ├── prebuilt-input-steps.js      # Text input, form filling
│   ├── prebuilt-select-steps.js     # Dropdown selections
│   ├── prebuilt-checkbox-steps.js   # Checkbox operations
│   ├── prebuilt-wait-steps.js       # Wait conditions
│   ├── prebuilt-scroll-steps.js     # Scrolling operations
│   ├── prebuilt-drag-and-drop-steps.js # Drag and drop
│   ├── prebuilt-alert-action-steps.js  # Alert handling
│   ├── prebuilt-frame-steps.js      # iFrame operations
│   ├── prebuilt-keyboard-action-steps.js # Keyboard actions
│   ├── prebuilt-field-assertion-steps.js # Element validations
│   ├── prebuilt-zoom-steps.js       # Browser zoom
│   ├── prebuilt-print-steps.js      # Print operations
│   └── prebuilt-other-steps.js      # Miscellaneous steps
└── backend/                 # Database testing steps
    ├── DBAssertions-steps.js        # Database validations
    ├── CSVAndDBAssertion-steps.js   # Data reconciliation
    └── procedure-steps.js           # Stored procedures
```

> **For step-by-step examples and tutorials**, see [QUICKSTART.md](./QUICKSTART.md)
> npm run test:performance # Web Vitals testing
> npm run test:lighthouse # Lighthouse performance audit

# Visual testing (Planned for v2.1)

npm run test:visual # Visual regression testing
npm run test:screenshots # Screenshot comparison

````

## Core Utilities

### PlaywrightApiMockUtils

Main utility class for API testing and mocking:

```javascript
// Initialize API context
await apiUtils.initializeApiContext(baseURL, options)

// Make API requests
await apiUtils.makeApiRequest(method, endpoint, options)

// Mock API endpoints
apiUtils.mockApiEndpoint(method, urlPattern, response, options)

// Verify mock calls
apiUtils.verifyMockCalled(method, urlPattern, expectedTimes)

// Get statistics
const stats = apiUtils.getStats()
````

### BrowserUtils

Browser management utilities:

```javascript
// Launch browser
await browserUtils.launchBrowser(options);

// Create new page
const page = await browserUtils.newPage();

// Close browser
await browserUtils.closeBrowser();
```

### DatabaseUtils

Database testing utilities:

```javascript
// Execute query
const results = await dbUtils.executeQuery(sql, params);

// Get connection
const connection = await dbUtils.getConnection();
```

## 🗺️ Framework Roadmap

### ✅ Version 1.0 (Current - Available Now)

**Focus: Core Testing Foundation**

- ✅ Playwright API Testing with native request context
- ✅ API Mocking and interception capabilities
- ✅ Cross-browser UI automation (Chrome, Firefox, Safari)
- ✅ BrowserStack cloud testing integration
- ✅ Cucumber BDD with Gherkin syntax
- ✅ Database testing (MySQL integration)
- ✅ Multi-environment support (DEV, TEST, STAGING, PROD)
- ✅ Comprehensive reporting (Allure, Cucumber HTML)
- ✅ File operations (Excel, CSV, JSON)
- ✅ Email testing with Nodemailer
- ✅ JSON schema validation

### Version 2.0 (Planned - Q3 2025)

**Focus: Mobile & Performance**

- **Mobile Testing** - Android and iOS device simulation
- **Performance Testing** - Web Vitals and Lighthouse integration
- **Docker Integration** - Containerized test execution
- **Extended Browser Support** - Additional browser versions
- **Enhanced Analytics** - Advanced test insights and metrics
- **Improved Parallel Execution** - Better resource management

### Version 2.1 (Planned - Q4 2025)

**Focus: Visual & Advanced Testing**

- **Visual Regression Testing** - Screenshot comparison
- **AI-Powered Test Generation** - Smart test creation
- **Performance Monitoring** - Continuous performance tracking
- **Advanced Debugging** - Enhanced error analysis
- **Native Mobile App Testing** - iOS/Android app automation
- **Multi-language Support** - Internationalization testing

### Future Considerations (v3.0+)

- **Machine Learning Integration** - Predictive test analysis
- **Real-time Test Execution** - Live test monitoring
- **Security Testing** - Automated vulnerability scanning
- **Microservices Testing** - Service mesh validation
- **Business Intelligence** - Test data analytics dashboard

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

- 📧 **Email**: support@example.com
- 📚 **Full Documentation**: [Complete Setup Guide](./QUICKSTART.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
