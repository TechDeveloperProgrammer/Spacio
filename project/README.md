# Smart Stream Overlay

A professional, production-ready browser source overlay for streaming platforms. Built with pure HTML5, CSS3, and Vanilla JavaScript - no external frameworks required.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## Features

- 🎨 **Smart Platform Detection** - Automatically detects Twitch or TikTok Live
- 🚀 **60 FPS Performance** - GPU-accelerated animations
- 📱 **Fully Responsive** - Works on all devices and screen sizes
- 🎭 **Multiple Themes** - 7+ pre-built themes with custom support
- ⚡ **Real-time Updates** - WebSocket support for live data
- 🎮 **Custom Commands** - Chat-based overlay control
- ✨ **Particle Effects** - Canvas-based particle engine
- 🧊 **Glassmorphism** - Modern blur and transparency effects
- 🔌 **Modular Architecture** - Easy to extend with new providers

## Project Structure

```
project/
├── index.html          # Main HTML file
├── style.css           # Complete stylesheet
├── config.js           # Central configuration
├── main.js             # Application entry point
├── utils.js            # Utility functions
├── themes.js           # Theme management
├── media.js            # Media asset handling
├── animations.js       # Animation system
├── particles.js        # Particle engine
├── providers.js        # Platform providers (Twitch, TikTok)
├── widgets.js          # UI widget management
├── commands.js         # Command system
├── README.md           # This file
└── assets/
    ├── icons/          # SVG icons
    ├── images/         # Images and avatars
    ├── videos/         # Video backgrounds
    ├── sounds/         # Sound effects
    └── fonts/          # Custom fonts
```

## Quick Start

### 1. Browser Source Setup

Add the overlay as a Browser Source in your streaming software:

**OBS Studio:**
1. Right-click Sources → Add → Browser
2. Name it "Stream Overlay"
3. Check "Local File"
4. Browse to `index.html`
5. Set Width: `1920`, Height: `1080`
6. FPS: `60`

**PRISM Live Studio:**
1. Add Layer → Webpage
2. Enter local path or hosted URL
3. Set dimensions to `1920x1080`

**StreamElements:**
1. Dashboard → Overlays → Create New
2. Add Widget → Browser Source
3. Upload files or use hosted URL

### 2. Configuration

Edit `config.js` to customize:

```javascript
const CONFIG = {
    platform: {
        mode: 'auto',  // 'auto', 'twitch', 'tiktok', 'dual'
        twitch: {
            channel: 'your_channel',
            clientId: 'your_client_id',
            accessToken: 'your_token',
        },
        tiktok: {
            roomId: 'your_room_id',
        },
    },
    appearance: {
        theme: 'default',  // 'default', 'dark', 'neon', 'glass', etc.
        primaryColor: '#9146ff',
    },
    // ... more options
};
```

### 3. Platform-Specific URLs

**Twitch Only:**
```
file:///path/to/project/index.html?platform=twitch
```

**TikTok Only:**
```
file:///path/to/project/index.html?platform=tiktok
```

**Dual Mode:**
```
file:///path/to/project/index.html?platform=dual
```

## Custom Commands

Control the overlay via chat commands (prefix: `!`):

| Command | Description | Example |
|---------|-------------|---------|
| `!show` | Show overlay | `!show` |
| `!hide` | Hide overlay | `!hide` |
| `!theme` | Change theme | `!theme neon` |
| `!panel` | Control panels | `!panel twitch` |
| `!stats` | Show statistics | `!stats` |
| `!reset` | Reset to defaults | `!reset` |
| `!color` | Change colors | `!color primary #ff0000` |
| `!background` | Set background | `!background image.jpg` |
| `!gif` | Display GIF | `!gif https://...` |
| `!sound` | Play sound | `!sound alert` |
| `!particles` | Control particles | `!particles count 100` |
| `!animation` | Toggle animations | `!animation disable` |
| `!layout` | Adjust layout | `!layout scale 1.5` |
| `!reload` | Reload overlay | `!reload` |
| `!help` | List commands | `!help` |

### Using Commands

**Via Chat Integration:**
Send messages starting with `!` in your chat (requires chat bot integration).

**Via Keyboard (Testing):**
Press `Ctrl+K` and type command without `!`.

**Via External API:**
```javascript
window.postMessage({
    action: 'command',
    data: '!theme neon'
}, '*');
```

## Available Themes

| Theme | Description |
|-------|-------------|
| `default` | Purple/cyan gradient with glass effects |
| `dark` | Minimal dark theme |
| `neon` | Cyberpunk neon colors |
| `glass` | Maximum glassmorphism |
| `minimal` | Clean, simple design |
| `twitch` | Twitch-branded purple |
| `tiktok` | TikTok cyan/pink |

## API Reference

### Global API

Access overlay features via `window.StreamOverlay`:

```javascript
// Core methods
StreamOverlay.start();
StreamOverlay.stop();
StreamOverlay.toggle();

// Configuration
StreamOverlay.setTheme('neon');
StreamOverlay.setPanel('twitch');
StreamOverlay.hidePanel('tiktok');

// Notifications
StreamOverlay.showNotification('Hello World!');

// Execute commands
StreamOverlay.executeCommand('!particles count 50');

// Get state
const state = StreamOverlay.getState();

// Export/Import config
const config = StreamOverlay.exportConfig();
StreamOverlay.importConfig(config);
```

### Module Access

```javascript
// Direct module access
StreamOverlay.themes.loadTheme('dark');
StreamOverlay.particles.setCount(100);
StreamOverlay.media.playSound('alert');
StreamOverlay.animations.fadeIn(element);
```

### External Events

Listen for overlay events from external scripts:

```javascript
window.addEventListener('message', (event) => {
    const { action, data } = event.data;
    
    if (action === 'update') {
        // Handle platform update
        if (data.platform === 'twitch') {
            StreamOverlay.providers.updateTwitch(data);
        }
    }
});
```

## Adding Custom Providers

Create a new provider in `providers.js`:

```javascript
// Register new provider
Providers.addProvider('youtube', {
    name: 'youtube',
    enabled: true,
    connect: async () => { /* connection logic */ },
    disconnect: () => { /* cleanup */ },
    update: (data) => { /* handle updates */ },
    isLive: () => { /* check status */ },
    getData: () => { /* return data */ },
});
```

## Creating Custom Themes

```javascript
Themes.createTheme('myTheme', {
    name: 'My Custom Theme',
    colors: {
        primary: '#your_color',
        secondary: '#your_color',
        accent: '#your_color',
        background: 'rgba(...)',
        text: '#ffffff',
    },
    effects: {
        glassBlur: 20,
        glassOpacity: 0.5,
        glowStrength: 15,
        borderRadius: 12,
    },
    fonts: {
        primary: "'Your Font', sans-serif",
        mono: "'Your Mono', monospace",
    },
});
```

## Performance Optimization

The overlay includes several optimizations:

- **GPU Acceleration** - CSS transforms and opacity
- **Debounced Resizing** - Prevents excessive recalculations
- **Lazy Rendering** - Only render visible elements
- **Efficient DOM Updates** - Batched updates
- **Memory Management** - Automatic cache cleanup
- **RequestAnimationFrame** - Smooth 60 FPS animations

### Best Practices

1. Keep particle count under 100 for best performance
2. Use compressed images (WebP format recommended)
3. Limit video backgrounds to short loops
4. Enable reduced motion for accessibility

## Troubleshooting

### Overlay Not Showing

1. Check Browser Source is enabled in OBS
2. Verify file path is correct
3. Check console for errors (Ctrl+Shift+J in OBS)
4. Ensure `CONFIG.general.autoHide` is false

### Platform Not Detected

1. Verify API credentials in `config.js`
2. Check network connectivity
3. Try manual mode: `?platform=twitch`
4. Review console logs for errors

### Poor Performance

1. Reduce particle count: `!particles count 30`
2. Disable animations: `!animation disable`
3. Lower theme complexity
4. Check GPU acceleration is enabled

### Commands Not Working

1. Ensure `CONFIG.commands.enabled` is true
2. Check user permissions
3. Verify command cooldown hasn't expired
4. Review command syntax

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Safari | 14+ | ⚠️ Limited |
| Opera | 76+ | ✅ Full |

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - See LICENSE file for details.

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ for streamers everywhere**

*Version 1.0.0*
