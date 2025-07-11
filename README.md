# Water Spanner

My personal web extension for multi-purpose.

## Features

### Pop-up Page

- Execute JavaScript code in the current page.
    - Automatically load clipboard content into the input field.
- Insert custom CSS into the current page.
    - Automatically load clipboard content into the input field.
- Find DOM information by clicking, as inspector (XPath, selector, etc.)

### Options Page

- Navigation bar with sections for General, Scripts, Styles, and About
- Settings for JavaScript execution timeout and console logging
- CSS injection mode configuration
- Mobile optimization settings

## Implementation Details

### New Features Added

1. **Enhanced JavaScript Execution**
   - Console.log output capture
   - Error capturing and display
   - Mobile-friendly textarea interface
   - Clipboard integration for quick code input

2. **CSS Injection System**
   - Inject custom CSS into active tab
   - Remove injected CSS
   - Quick CSS examples (gray background, debug outline, grayscale images)
   - Real-time feedback on injection status

3. **DOM Inspector**
   - Click-to-inspect functionality
   - XPath and CSS selector generation
   - Element information display (tag name, ID, class, text content)
   - Copy-to-clipboard functionality for selectors

4. **Searchable Tab Interface**
   - Search through available features
   - Tab-based navigation in popup
   - Mobile-optimized sizing (350x500px)

5. **Enhanced Options Page**
   - Navigation bar component
   - Organized settings sections
   - About page with feature overview

### Technical Stack

- **SolidJS** - Reactive UI framework
- **Bulma CSS** - Mobile-first CSS framework
- **TypeScript** - Type safety
- **Vite** - Build tooling
- **SCSS** - Enhanced styling

### Cross-browser Compatibility

- Supports both Manifest V2 (Firefox) and V3 (Chrome)
- Conditional script execution based on browser capabilities
- Unified API using webextension-polyfill
