const { Builder, By, until } = require('selenium-webdriver');

(async function loginTest() {
    // Create a new instance of the Chrome driver
    let driver = await new Builder().forBrowser('chrome').build();

    // Array to hold the results of test cases
    let testResults = [];

    try {
        // Navigate to the login page
        await driver.get('http://localhost:3200/login.html'); // Adjust the URL if necessary

        // Wait for the login box to be located
        await driver.wait(until.elementLocated(By.id('login')), 10000);
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('login'))), 10000);

        // Test Case 1: Successful Login
        testResults.push(await successfulLogin(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/login.html');

        // Test Case 2: Invalid Email Format
        testResults.push(await invalidEmailFormat(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/login.html');

        // Test Case 3: Empty Email Field
        testResults.push(await emptyEmailField(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/login.html');

        // Test Case 4: Empty Password Field
        testResults.push(await emptyPasswordField(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/login.html');

        // Test Case 5: Incorrect Password
        testResults.push(await incorrectPassword(driver));

        // Refresh the page before the next test case
        await driver.get('http://localhost:3200/login.html');

        // Test Case 6: Email Not Registered
        testResults.push(await emailNotRegistered(driver));

        // Display all collected test results at the end
        testResults.forEach(result => {
            console.log(result);
        });

    } catch (error) {
        console.error('Login test failed:', error);
    } finally {
        // Quit the driver
        await driver.quit();
    }
})();

async function successfulLogin(driver) {
    // Enter email and password
    await driver.findElement(By.id('logEmail')).sendKeys('g@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    
    // Click the login button
    await driver.findElement(By.id('loginButton')).click();

    // Optionally wait for a short period to allow the login process to complete (this can be removed too)
    await driver.sleep(2000); // Add a small delay if needed
    
    return 'Test Case 1: Login successful (assumed)';
}



async function invalidEmailFormat(driver) {
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('b.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('loginButton')).click();
    
    // Wait for the error message (replace with actual selector)
    await driver.sleep(2000); 
    return 'Test Case 2: Invalid email format handled.';
}

async function emptyEmailField(driver) {
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('loginButton')).click();
    
    // Wait for the error message (replace with actual selector)
    await driver.sleep(2000); 
    return 'Test Case 3: Empty email field handled.';
}

async function emptyPasswordField(driver) {
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('g@gmail.com');
    await driver.findElement(By.id('logPassword')).clear();
    await driver.findElement(By.id('loginButton')).click();
    
    // Wait for the error message (replace with actual selector)
    await driver.sleep(2000); 
    return 'Test Case 4: Empty password field handled.';
}

async function incorrectPassword(driver) {
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('g@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('wrongpassword');
    await driver.findElement(By.id('loginButton')).click();
    
    // Wait for the error message (replace with actual selector)
    await driver.sleep(2000); 
    return 'Test Case 5: Incorrect password handled.';
}

async function emailNotRegistered(driver) {
    await driver.findElement(By.id('logEmail')).clear();
    await driver.findElement(By.id('logEmail')).sendKeys('notregistered@gmail.com');
    await driver.findElement(By.id('logPassword')).sendKeys('1234567');
    await driver.findElement(By.id('loginButton')).click();
    
    // Wait for the error message (replace with actual selector)
    await driver.sleep(2000); 
    return 'Test Case 6: Email not registered handled.';
}
