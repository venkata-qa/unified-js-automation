@regression @environment
Feature: UI Testing with Environment Configuration

  @login @ui @env-parabank
  Scenario: Web test for parabank UI using environment URL
    Given the URL configuration should be valid
    Given I navigate to "parabank" application from environment
    And I enter value "testuser" in field "usernameElement" on "ParaBankLoginPage"
    And I enter value "testpassword" in field "passwordElement" on "ParaBankLoginPage"
    When I click on "loginElement" from "ParaBankLoginPage"

  @ui @env-demo
  Scenario: Navigate to demo application from environment
    Given the URL configuration should be valid
    Given I navigate to "demo" application from environment
    Then the page should be loaded

  @ui @traditional
  Scenario: Navigate to a specific page (traditional way)
    Given I am in App site "HomePage"
    And I navigate to application "demoUrl"

  @ui @keyboard-env
  Scenario: Test keyboard functionality using environment URL
    Given the URL configuration should be valid
    Given I navigate to keyboard testing page from environment
    When I press "Enter" key on the page
    And I type "Hello World" on the keyboard input field

  @ui @dragdrop-env
  Scenario: Test drag and drop functionality using environment URL
    Given the URL configuration should be valid
    Given I navigate to drag and drop testing page from environment
    # Add your drag and drop test steps here

  @ui @alerts-env
  Scenario: Test alert functionality using environment URL
    Given the URL configuration should be valid
    Given I test alerts on "alerts" application from environment
    # Add your alert test steps here

  @ui
  Scenario: Navigate forward and backward in browser history
    Given I am in App site "HomePage"
    And I navigate to application "demoUrl"
    When I navigate forward on the browser
    Then I navigate back on the browser

  @ui
  Scenario: Refresh the current web page
    Given I am in App site "HomePage"
    And I navigate to application "demoUrl"
    When I refresh the current web page

  @ui
  Scenario: Switch between browser windows
    Given I am in App site "HomePage"
    And I navigate to application "demoUrl"
    When I switch to new window
    Then I switch to previous window

  @ui
  Scenario: Maximize the browser window
    Given I am in App site "HomePage"
    And I navigate to application "demoUrl"
    When I maximize the windows

  @excel @ui
  Scenario: Read data from excel file and validate it
    Given I have a excel file "userdata.xlsx"
    When I read the data from excel
    And I navigate to application "parabankUrl"
    And I enter value on "ParaBankLoginPage" and click "loginElement"

  @ui
  Scenario: Web test for code coverage
    Given I navigate to application "basicUIDemo"
    And I enter value "testuser" in field "usernameElement" on "BasicUIPage"
    And I enter value "testpassword" in field "passwordElement" on "BasicUIPage"
    And I enter value "This is first comment" in field "commentsElement" on "BasicUIPage"
    And I select checkbox on "checkbox1" from "BasicUIPage"
    And I verify checkbox selected state "selected" for "checkbox1" on "BasicUIPage"
    And I scroll to "end" of page
    And I select the "value" option type with value "ms2" from the "selectElement" dropdown menu on the "BasicUIPage"
    And I select the "value" option type with value "dd3" from the "dropdownElement" dropdown menu on the "BasicUIPage"
    When I click on "loginElement" from "BasicUIPage"
    Then I verify title "Processed Form Details" is displayed

  @ui
  Scenario: Web test for code coverage alert accept example
    Given I navigate to application "basicUIDemoAlert"
    And I accept the alert from "alertButton" on "BasicUIPage"

  @ui
  Scenario: Web test for code coverage alert dismiss example
    Given I navigate to application "basicUIDemoAlert"
    And I dismiss the alert from "alertButton" on "BasicUIPage"

  @ui
  Scenario: Web test for code coverage alert text example
    Given I navigate to application "basicUIDemoAlert"
    And I should see alert text as "I am an alert box!" from "alertButton" on "BasicUIPage"

  @ui
  Scenario: Web test for code coverage alert text example
    Given I navigate to application "dragAndDropUrl"
    When Perform drag "sourceElement" and drop "destinationElement" on "BasicUIPage" page

  @ui
  Scenario: Web test for code coverage of keyborad actions
    Given I navigate to application "keyBoardPage"
    Then I press enter button for the "textBox" on the "KeyBoardPage"
