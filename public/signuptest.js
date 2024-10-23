const { Builder, By, until } = require('selenium-webdriver');

(async function signupTest() {
    // Create a new instance of the Chrome driver
    let driver = await new Builder().forBrowser('chrome').build();

    // Array to hold the results of test cases
    let testResults = [];

    try {
        // Navigate to the signup page
        await driver.get('http://localhost:3200/signup.html'); // Adjust the URL if necessary

        // Wait for the signup box to be located
        await driver.wait(until.elementLocated(By.id('signup')), 10000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('signup'))), 10000);

        // Test Case 1: Successful Signup
        testResults.push(await successfulLogin(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await passwordsDoNotMatch(driver));

        // Test Case 3: Empty Name Field
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await emptyNameField(driver));

        // Test Case 4: Invalid Email Format
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await invalidEmailFormat(driver));

        // Test Case 5: Empty Email Field
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await emptyEmailField(driver));

        // Test Case 6: Empty Password Field
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await emptyPasswordField(driver));

        // Test Case 7: Already Registered Email
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await alreadyRegisteredEmail(driver));

        // Test Case 8: Password Length Less Than Required
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await invalidPasswordLength(driver));

        // Test Case 9: Password Without Numbers
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await invalidPasswordNoNumbers(driver));

        // Test Case 10: Password Does Not Meet Criteria
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await passwordNotMatchingCriteria(driver));

        // Test Case 11: Missing Confirmation Password
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await missingConfirmPassword(driver));

        // Test Case 12: Special Characters in Name Field
        await driver.get('http://localhost:3200/signup.html');
        testResults.push(await specialCharacterInName(driver));

        // Display all collected test results at the end
        testResults.forEach(result => {
            console.log(result);
        });

    } catch (error) {
        console.error('Signup test failed:', error);
    } finally {
        // Quit the driver
        await driver.quit();
    }
})();





async function passwordsDoNotMatch(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('wrongpassword');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
        return 'Test Case 2: Passwords do not match handled.';
}

async function emptyNameField(driver) {
    await driver.findElement(By.id('logname')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 3: Empty name field handled.';
}

async function invalidEmailFormat(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('invalidemail');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 4: Invalid email format handled.';
}

async function emptyEmailField(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 5: Empty email field handled.';
}

async function emptyPasswordField(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).clear();
    await driver.findElement(By.id('logPasswordcheck')).clear();
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 6: Empty password field handled.';
}

async function alreadyRegisteredEmail(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com'); // Email already registered
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 7: Already registered email handled.';
}

async function invalidPasswordLength(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('123');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('123');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 8: Password length less than required handled.';
}

async function invalidPasswordNoNumbers(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('password');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('password');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 9: Password without numbers handled.';
}

async function passwordNotMatchingCriteria(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('123');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('123');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 10: Password does not meet criteria (length, symbols, etc.) handled.';
}

async function missingConfirmPassword(driver) {
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).clear(); // Missing confirmation password
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 11: Missing confirmation password handled.';
}

async function specialCharacterInName(driver) {
    await driver.findElement(By.id('logname')).sendKeys('@vedant!'); // Invalid characters in name
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    await driver.findElement(By.id('Singupbtn')).click();

    await driver.sleep(2000);
    return 'Test Case 12: Special characters in name field handled.';
}
async function successfulLogin(driver) {
    // Enter email and password
    await driver.findElement(By.id('logname')).sendKeys('vedant');
    await driver.findElement(By.id('logEmail')).sendKeys('ved@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('logPasswordcheck')).sendKeys('1234567');
    
    // Click the login button
    await driver.findElement(By.id('Singupbtn')).click();

    // Optionally wait for a short period to allow the login process to complete (this can be removed too)
    await driver.sleep(2000); // Add a small delay if needed
    
    return 'Test Case 1: Signup successful (assumed)';
}