# Smart Overlay - Browser Source

A professional, production-ready browser source overlay for streaming platforms. Built with vanilla HTML5, CSS3, and JavaScript ES2023.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🎯 Smart Platform Detection
- **Auto-detect** Twitch or TikTok Live streams
- **Single panel mode** - Shows only the active platform
- **Dual panel mode** - Display both platforms simultaneously
- **Configurable modes**: Auto, Twitch, TikTok, or Dual

### 🎨 Visual Effects
- Glassmorphism with blur effects
- Neon glow animations
- Animated borders with light sweep
- RGB gradients
- Smooth counter animations
- Particle engine (Canvas API)
- Multiple animation types: Fade, Slide, Zoom, Pulse, Elastic, Bounce

### 📊 Real-Time Stats
- Viewers count
- Followers/Fans
- Subscribers
- Bits/Gifts
- Uptime tracker
- Stream title & category
- Follower goals with progress bars
- Event feed (follows, subs, raids, etc.)

### 🎮 Custom Commands
```
!show          - Show overlay
!hide          - Hide overlay
!theme <name>  - Change theme
!panel         - Toggle panels
!stats         - Show statistics
!reset         - Reload overlay
!color <hex>   - Change primary color
!background    - Set background
!image         - Update avatar
!gif           - GIF background
!video         - Video background
!sound         - Play sound effect
!font          - Change font
!animation     - Toggle animations
!particles     - Control particles
!layout        - Change position
!scale         - Adjust scale
!opacity       - Set opacity
!reload        - Refresh config
```

### 🌈 Pre-built Themes
- Default
- Twitch Purple
- TikTok Neon
- Dark Mode
- Glass Morphism
- Cyberpunk
- Sunset Gradient
- Ocean Blue

## Installation

### Step 1: Download Files
Copy all project files to your streaming computer:
```
overlay/
├── index.html
├── style.css
├── main.js
├── config.js
├── utils.js
├── themes.js
├── media.js
├── animations.js
├── particles.js
├── providers.js
├── widgets.js
├── commands.js
└── assets/
    ├── icons/
    ├── images/
    ├── videos/
    ├── sounds/
    └── fonts/
```

### Step 2: Configure Settings
Edit `config.js` to customize:
- Your Twitch channel name
- Your TikTok username/roomId
- Theme preferences
- Display settings
- Sound effects
- And more!

## OBS Studio Setup

1. Open OBS Studio
2. Add a new **Browser Source**
3. Check **"Local file"**
4. Click **"Browse"** and select `index.html`
5. Set dimensions:
   - Width: `1920`
   - Height: `1080`
6. (Optional) Add URL parameters:
   ```
   ?theme=twitch&mode=auto&scale=1
   ```
7. Click **OK**

## PRISM Live Studio Setup

1. Open PRISM Live Studio
2. Click **"+"** to add a layer
3. Select **"Webpage"**
4. Enter the local file path:
   ```
   file:///C:/path/to/overlay/index.html
   ```
5. Set width: `1920`, height: `1080`
6. Click **Add**

## StreamElements Setup

### Option A: Local File
1. In StreamElements Dashboard, go to **Overlays**
2. Create/Edit overlay
3. Add **Browser Source** widget
4. Upload `index.html` as custom HTML
5. Copy all CSS to custom CSS section
6. Copy all JS to custom JS section

### Option B: Hosted URL
1. Host the overlay files on a web server
2. In StreamElements, add Browser Source
3. Enter the URL to your hosted `index.html`
4. Set dimensions to `1920x1080`

## URL Parameters

Pass configuration via URL:
```
index.html?theme=twitch&mode=twitch&scale=1.2&position=top-right
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| theme | default, twitch, tiktok, dark, glass, cyberpunk, sunset, ocean | Active theme |
| mode | auto, twitch, tiktok, dual | Display mode |
| scale | 0.5 - 2.0 | Scale factor |
| position | top-left, top-right, bottom-left, bottom-right, center | Panel position |

## Customization Guide

### Creating Custom Themes

Add to `config.js` or use the `!theme` command:

```javascript
Themes.createTheme('myTheme', {
    name: 'My Custom Theme',
    colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        background: 'rgba(0,0,0,0.9)',
        text: '#ffffff',
        glass: 'rgba(255,255,255,0.1)',
        border: 'rgba(255,255,255,0.2)'
    },
    effects: {
        glassmorphism: true,
        blur: 15,
        glow: true,
        shadows: true,
        animatedBorders: true,
        neonGlow: true
    }
});
```

### Adding New Commands

```javascript
Commands.register('mycommand', (args, user) => {
    // Your logic here
    Widgets.showAlert('Hello', `${user} triggered the command!`);
    return 'Command executed!';
}, {
    cooldown: 5000,
    permissions: ['all']
});
```

### Adding Custom Providers

Create a new provider in `providers.js`:

```javascript
const Providers = {
    // ... existing code
    
    initYouTube() {
        this.active.youtube = {
            connected: false,
            connect: () => {
                // YouTube API integration
            },
            disconnect: () => {
                // Cleanup
            }
        };
    }
};
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+S | Toggle overlay |
| Ctrl+Shift+R | Reload overlay |
| Ctrl+Shift+D | Toggle debug mode |
| Ctrl+Shift+P | Toggle particles |
| Ctrl+K | Execute command |
| F12 | Show stats |

## Troubleshooting

### Overlay not showing
1. Check that `index.html` is correctly loaded
2. Verify Browser Source dimensions are set
3. Ensure no CSS errors in console
4. Try `!show` command

### Stats not updating
1. Configure your channel/username in `config.js`
2. Check internet connection
3. Verify platform API access
4. Enable debug mode: `Ctrl+Shift+D`

### Performance issues
1. Reduce particle count: `!particles count 20`
2. Disable animations: `!animation toggle`
3. Lower blur strength in config
4. Reduce max events in config

### Sounds not playing
1. Ensure sound files exist in `assets/sounds/`
2. Check volume setting in config
3. Browser may require user interaction first
4. Verify file paths are correct

## Performance Optimization

The overlay includes several optimizations:

- **GPU Acceleration**: CSS transforms and opacity
- **RequestAnimationFrame**: 60 FPS smooth animations
- **ResizeObserver**: Efficient responsive handling
- **Debouncing/Throttling**: Prevent excessive updates
- **Memory Management**: Automatic cleanup
- **Lazy Rendering**: Only render visible elements

## Browser Compatibility

- ✅ Chrome/Chromium (Recommended)
- ✅ OBS Browser Source (CEF)
- ✅ PRISM Live Studio
- ✅ StreamElements
- ⚠️ Firefox (limited support)
- ❌ Internet Explorer (not supported)

## Project Structure

```
project/
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── config.js           # Configuration settings
├── main.js             # Application entry point
├── utils.js            # Utility functions
├── themes.js           # Theme management
├── media.js            # Media handling
├── animations.js       # Animation system
├── particles.js        # Particle engine
├── providers.js        # Platform providers
├── widgets.js          # UI widgets
├── commands.js         # Command system
└── assets/             # Media files
```

## API Reference

### Window.SmartOverlay

Access overlay functions externally:

```javascript
// Show/hide
SmartOverlay.show();
SmartOverlay.hide();
SmartOverlay.toggle();

// Get status
const status = SmartOverlay.getStatus();

// Execute command
SmartOverlay.executeCommand('theme', 'api');

// Simulate event
SmartOverlay.simulateEvent('twitch', {
    type: 'follow',
    message: 'New follower!'
});

// Get/update config
const config = SmartOverlay.getConfig();
SmartOverlay.updateConfig({ theme: { active: 'dark' }});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - Feel free to use in your projects!

## Support

For issues and questions:
1. Check the troubleshooting section
2. Enable debug mode (`Ctrl+Shift+D`)
3. Check browser console for errors
4. Review configuration settings

---

**Created with ❤️ for streamers everywhere**
