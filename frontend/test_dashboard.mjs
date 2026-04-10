import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Log console messages
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    console.log('Navigating to dashboard...');
    await page.goto('http://localhost:5173/dashboard');

    // Let the JS run for 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    console.log('Done.');
    await browser.close();
})();
