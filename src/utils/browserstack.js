const logger = require('./logger');

class BrowserStackUtils {
    /**
     * Update BrowserStack session status using the official browserstack_executor method
     * This is the BrowserStack recommended approach for Playwright
     */
    static async updateSessionStatus(page, status, reason) {
        if (process.env.ENV !== 'browserstack') {
            logger.info('Not running on BrowserStack, skipping status update');
            return false;
        }

        try {
            console.log(`Setting BrowserStack session status to: ${status}`);
            console.log(`Reason: ${reason || `Test ${status}`}`);
            
            // Method 1: Using executeScript (BrowserStack recommended)
            const script = `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}","reason": "${reason || `Test ${status}`}"}}`;
            
            try {
                await page.evaluate((script) => {
                    // Execute the BrowserStack command
                    eval(script);
                }, script);
                
                console.log(`BrowserStack status set via executeScript: ${status}`);
                return true;
            } catch (error) {
                console.warn('Method 1 failed, trying alternative approach:', error);
            }

            // Method 2: Direct window object assignment (fallback)
            try {
                await page.evaluate(({ status, reason }) => {
                    window.browserstack_executor = {
                        action: 'setSessionStatus',
                        arguments: {
                            status: status,
                            reason: reason || `Test ${status}`
                        }
                    };
                    
                    // Force execution by logging
                    console.log('BrowserStack executor set:', window.browserstack_executor);
                }, { status, reason: reason || `Test ${status}` });
                
                // Give BrowserStack time to process
                await page.waitForTimeout(2000);
                
                console.log(`BrowserStack status set via window object: ${status}`);
                return true;
            } catch (error) {
                console.error('Both methods failed to set BrowserStack status:', error);
                return false;
            }
        } catch (error) {
            console.error('Failed to update BrowserStack session status:', error);
            return false;
        }
    }

    /**
     * Set session name (optional, can be used for better identification)
     */
    static async setSessionName(page, name) {
        if (process.env.ENV !== 'browserstack') {
            return false;
        }

        try {
            await page.evaluate((name) => {
                window.browserstack_executor = {
                    action: 'setSessionName',
                    arguments: {
                        name: name
                    }
                };
            }, name);
            
            console.log(`BrowserStack session name set to: ${name}`);
            return true;
        } catch (error) {
            console.warn('Failed to set BrowserStack session name:', error);
            return false;
        }
    }
}

module.exports = { BrowserStackUtils };
