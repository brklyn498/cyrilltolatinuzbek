
import time
from playwright.sync_api import sync_playwright

def verify_converter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:3030")

        # Wait for app to load
        page.wait_for_selector("text=MATN KONVERTORI")

        # Test 1: Initial State - Cyrillic Input
        # Default sample text is in Cyrillic.
        # Check if output is generated (convertText runs on mount)
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/1_initial_state.png")

        # Test 2: Toggle Mode
        # Find the Toggle button (CYRILLIC ⇄ LATIN)
        toggle_btn = page.get_by_role("button", name="CYRILLIC ⇄ LATIN")
        toggle_btn.click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/2_toggled_latin_to_cyrillic.png")

        # Test 3: Auto-detection
        # Clear input
        page.get_by_role("button", name="Kirishni Tozalash").click()

        # Type Latin text
        input_area = page.locator("textarea").first
        input_area.fill("Salom O'zbekiston")

        # Wait for auto-detection and conversion
        page.wait_for_timeout(1000)

        # Take screenshot of auto-detected state
        page.screenshot(path="verification/3_auto_detected.png")

        browser.close()

if __name__ == "__main__":
    verify_converter()
