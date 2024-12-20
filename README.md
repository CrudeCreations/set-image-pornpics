# Set Image PornPics
<a href='https://ko-fi.com/C0C1RST97' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

A Stash plugin that enables easy image management by integrating with PornPics.com. Search and set images for your scenes, groups, performers, and tags directly from within Stash.

## Features

- Search PornPics.com's extensive image library directly from Stash
- Set cover images for:
  - Scenes
  - Groups (front and back images)
  - Performers
  - Tags
- Automatic bulk tag image setting for tags
- Responsive image gallery with previews

## Installation (Source URL)

1. Go to Stash -> Settings -> Available Plugins and click the `Add Source` button
2. Enter `https://crudecreations.github.io/stash-plugins/stable/plugins.yaml`
3. Expand CrudeCreations and check `Set Image PornPics` and click the `Install` button  

## Installation (Manual)

1. Download the latest release from the [releases page](https://github.com/CrudeCreations/set-image-pornpics/releases)
2. Extract the ZIP file into your Stash plugins directory:
   ```
   ~/.stash/plugins/set-image-pornpics/
   ```
3. Restart Stash
4. Enable the plugin in Settings > Plugins
5. Configure plugin settings to show/hide buttons in different contexts

## Usage

### Setting Individual Images

1. Navigate to any scene, group, performer, or tag edit page
   - You must enable the button for scenes and groups in settings
2. Click the "Search PornPics..." button
3. Enter your search query
4. Browse through the gallery results
5. Click an image to view the full set
6. Select your desired image to set it as the cover

### Bulk Tag Image Setting

1. Go to Settings > Tasks
2. Find "Set Image for all blank tags"
3. Click "Run" to automatically set images for tags without covers
   - Note: Remember to back up your database before running bulk operations

## Configuration

The plugin can be configured in Settings > Plugins > Set Image PornPics:

- `show_edit_scene`: Show the search button when editing scenes
- `show_edit_group`: Show the search button when editing groups

## Development

### Prerequisites

- Node.js (v18+)
- Python 3.x
- Stash (latest version recommended) installed locally

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/CrudeCreations/set-image-pornpics.git
   cd set-image-pornpics
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:
   **Warning**
    currently npm run start is broken, just run npm run deploy

   ```bash
   npm run start
   ```

### Building

Build the plugin for production:

```bash
npm run build
```

Deploy to your local Stash installation:

```bash
npm run deploy
```

### Project Structure

- `/src`: TypeScript source code
  - `/api`: Stash API integration
  - `/components`: React components
  - `/utils`: Utility functions
- `/plugin`: Python backend code
- `set-image-pornpics.yml`: Plugin configuration

## Contributing

1. Fork the `dev` repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to the `dev` branch

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [issues page](https://github.com/CrudeCreations/set-image-pornpics/issues)
2. Create a new issue if your problem isn't already reported

## Acknowledgments

- [Stash](https://github.com/stashapp/stash) for the amazing media organizer
- PornPics.com for their image API
