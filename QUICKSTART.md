# Quick Start Guide - Playwright Test Automation Framework

## Get Running in 5 Minutes

This guide will get you up and running with the Playwright Test Automation Framework in just a few minutes.

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm 8+ installed
- ✅ Git installed

Check your versions:

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
git --version   # Any recent version
```

## 🛠️ Step 1: Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd playwright_js

# Install all dependencies
npm install

# Install Playwright browsers (Chrome, Firefox, Safari)
npm run setup
```

## Step 2: Verify Installation

```bash
# Run health check
npm run health

# You should see output like:
# ✅ Node.js version: 18.x.x
# ✅ npm version: 8.x.x
# ✅ Playwright installed
# ✅ All browsers ready
```

## ✅ Step 3: Run Your First Tests

### Start with Local Tests

```bash
# Run the default test suite (UI tests, headless)
npm run test

# Or run specific test types
npm run test:local    # UI tests (headless)
npm run test:api      # API tests only
```

**Expected Output:**

```
4 scenarios (4 passed)
16 steps (16 passed)
0m14.234s

✅ Tests completed successfully!
```

### Try BrowserStack Cloud Testing

```bash
# Run on Windows Chrome
npm run bs:win

# Run on macOS Safari  
npm run bs:mac
```

### Development Mode

```bash
# Run with visible browser (great for debugging)
npm run dev
# OR
HEADLESS=false npm run test:local
```

## ✅ Step 4: View Test Reports

```bash
# Generate and open Allure report
npm run report

# Check framework health
npm run health

# View framework status
npm run status
```

## 📋 Quick Command Reference

### Essential Commands
```bash
# Setup
npm run setup         # Install browsers
npm run health        # Check system health

# Local Testing  
npm run test          # Default (UI tests headless)
npm run test:local    # UI tests (headless)
npm run test:api      # API tests only
npm run test:ui       # UI tests with Chrome
npm run dev           # Development mode (visible browser)

# BrowserStack Cloud Testing
npm run bs:win        # Windows Chrome
npm run bs:mac        # macOS Safari
npm run bs:ios        # iOS Safari
npm run bs:android    # Android Chrome

# Utilities
npm run clean         # Clean reports
npm run report        # Generate & open report
npm run lint          # Fix code issues
npm run format        # Format code
```

### Environment Variables
```bash
# Run with visible browser
HEADLESS=false npm run test:local

# Specify browser
BROWSER=firefox npm run test:ui

# Debug mode
DEBUG=* npm run test:api
```

## Step 5: Try API Testing & Mocking

Create a simple test file to understand the framework:

### Create Your First Feature File

Create `tests/features/quickstart/quickstart-api.feature`:

```gherkin
Feature: Quick Start API Testing
  As a new user
  I want to understand how to use this framework
  So that I can start testing APIs quickly

  @quickstart @playwright-api-working
  Scenario: My first API test
    Given I setup Playwright API context with base URL "https://httpbin.org"
    When I make a Playwright API "GET" request to "/json"
    Then the Playwright API response status should be 200
    And the Playwright API response should contain field "slideshow.title"

  @quickstart @playwright-api-working
  Scenario: API test with custom data
    Given I setup Playwright API context with base URL "https://httpbin.org"
    When I make a Playwright API "POST" request to "/post" with data:
      """
      {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "tester"
      }
      """
    Then the Playwright API response status should be 200
    And the Playwright API response should contain field "json.name" with value "John Doe"
```

### Run Your Custom Test

```bash
# Run your quickstart test
npm run test -- --tags "@quickstart"
```

## 🎯 Step 6: Understanding the Test Structure

### 1. Feature Files (Gherkin/BDD)

Located in `tests/features/` - these describe WHAT to test:

```gherkin
Feature: User Management
  Scenario: Get user profile
    Given I setup API context
    When I make a GET request to "/users/1"
    Then the response should contain user data
```

### 2. Step Definitions (JavaScript)

Located in `tests/step-definitions/` - these define HOW to test:

```javascript
Given('I setup API context', async function () {
  await this.apiUtils.initializeApiContext('https://api.example.com');
});
```

### 3. Utilities (Core Framework)

Located in `src/utils/` - these provide the testing capabilities:

- `PlaywrightApiMockUtils.js` - API testing and mocking
- `BrowserUtils.js` - Browser automation
- `DatabaseUtils.js` - Database testing

## 🔧 Step 7: Configuration

### Environment Configuration

Edit configuration files in the project:

```bash
# View available configurations
ls -la *.config.js
ls -la cucumber.js

# Key files:
# - playwright.config.js (Playwright settings)
# - cucumber.js (Cucumber settings)
# - allure.config.js (Reporting settings)
```

### Common Settings

```bash
# Run tests in different environments
NODE_ENV=test npm run test:api
NODE_ENV=dev npm run test:api

# Change browser
BROWSER=firefox npm run test:ui

# Enable video recording
RECORD_VIDEO=true npm run test:ui

# Run with visible browser
HEADLESS=false npm run test:ui
```

## Step 8: API Mocking Demo

Try API mocking to see advanced capabilities:

```bash
# Create a mocking demo feature file
mkdir -p tests/features/quickstart
cat > tests/features/quickstart/mocking-demo.feature << 'EOF'
Feature: API Mocking Demo
  As a developer
  I want to mock API responses
  So that I can test without depending on external services

  @quickstart @api-mock
  Scenario: Mock API response
    Given I setup a mock server
    And I mock the API "GET" "**/users/123" with response:
      """
      {
        "id": 123,
        "name": "Mocked User",
        "email": "mock@example.com",
        "status": "active"
      }
      """
    When I make a request to the mocked endpoint "/users/123"
    Then the response should contain the mocked data
    And the mock should have been called exactly 1 time
EOF
```

## Step 9: Next Steps

Now that you're running, here are suggested next steps:

### Immediate Next Steps (Today)

1. ✅ **Explore existing tests**: Look at `tests/features/` to see more examples
2. ✅ **Try different test types**: `npm run test:api`, `npm run test:ui`, `npm run test:e2e`
3. ✅ **Check the reports**: After any test run, use `npm run report`

### This Week

1. **Write your first real test**: Add a test for your actual application
2. **Set up CI/CD**: Add these tests to your build pipeline  
3. **Explore BrowserStack**: Try cloud testing with `npm run bs:win` or `npm run bs:mac`

### This Month

1. **Build a comprehensive test suite**: Cover your critical user journeys
2. **Implement data-driven testing**: Use JSON files for test data
3. **Set up monitoring**: Regular test execution with reporting

## Need Help?

### Quick Debugging

```bash
# If tests fail, try these debugging steps:

# 1. Run with visible browser
HEADLESS=false npm run test:local

# 2. Run specific test types
npm run test:api     # API tests only
npm run test:ui      # UI tests only

# 3. Run in development mode
npm run dev

# 4. Check framework health
npm run health

# 5. Check logs
ls -la logs/
cat logs/automation-$(date +%Y-%m-%d).log
```

### Common Issues & Solutions

**Issue**: `npm install` fails
**Solution**: Clear npm cache: `npm cache clean --force`

**Issue**: Tests fail with "browser not found"
**Solution**: Reinstall browsers: `npm run install:browsers`

**Issue**: API tests timeout
**Solution**: Check your network connection and try: `npm run test:api:quick`

**Issue**: Reports don't open
**Solution**: Generate manually: `npm run allure:generate && npm run allure:open`

### Getting Support

- **Full Documentation**: See the main README.md
- **Example Tests**: Check `tests/features/` directory
- **Step Definitions**: Look at `tests/step-definitions/`
- **Utilities**: Explore `src/utils/` for advanced features

## Quick Step Definitions Reference

### Most Common API Steps (Get Started Fast)

```gherkin
# Setup and simple requests
Given I setup Playwright API context with base URL "https://api.example.com"
When I make a Playwright API "GET" request to "/users"
When I make a Playwright API "POST" request to "/users" with data:
  """
  {"name": "John", "email": "john@example.com"}
  """

# Response validation
Then the Playwright API response status should be 200
Then the Playwright API response should contain field "data.id"
Then the Playwright API response field "data.name" should be "John"
```

### Essential UI Steps (Quick Start)

```gherkin
# Navigation and clicking
Given I navigate to application "LoginPage"
Given I click on "Login Button" from "LoginPage"

# Input and validation
Given I enter value "john@example.com" in field "Email Field" on "LoginPage"
Then I verify that the field "Success Message" should be visible on the "HomePage"
```

### Basic Database Steps

```gherkin
Given I connect to the database
When I execute the query "SELECT * FROM users WHERE id = 1"
Then I validate the database result count is 1
```

> **For the complete step definitions reference with all available steps, see [README.md - Complete Step Definitions Reference](./README.md#-complete-step-definitions-reference)**

### **Quick Tips:**

1. **Start with Playwright API steps** - They're faster and more reliable
2. **Use descriptive names** - Replace `"PageName"` with your actual page objects
3. **Check examples** - Look at `tests/features/` for working examples
4. **Mix and match** - Combine API, UI, and database steps in scenarios

## Congratulations!

You're now ready to use the Playwright Test Automation Framework!

**What you've accomplished:**

- ✅ Installed and verified the framework
- ✅ Run your first API and UI tests
- ✅ Generated test reports
- ✅ Created your own test file
- ✅ Understood the project structure

**You're ready to:**

- Write tests for your applications
- Integrate with your CI/CD pipeline  
- Scale your test automation efforts

## 🎯 Next Steps

### Immediate Actions
1. **Explore the framework**: `npm run status` - see all available features
2. **Run your tests**: `npm run test` - execute the test suite
3. **Check health**: `npm run health` - verify everything is working
4. **Generate reports**: `npm run report` - view test results

### Advanced Usage
- **BrowserStack Testing**: Try `npm run bs:win` for cloud testing
- **Custom Tests**: Create your own `.feature` files in `tests/features/`
- **CI/CD Integration**: Add the commands to your build pipeline
- **Team Collaboration**: Share the simplified command structure

> **📚 For complete documentation**, see [README.md](./README.md)

---

**🚀 Framework is production-ready and optimized for your testing needs!**
