# Wallfly AI landing page

A small, English landing page built with HTML, CSS and vanilla JavaScript. No dependencies, build step, backend, analytics or external fonts. The app demo is a browser-rendered illustration with fictional content, styled after the supplied app screenshot, with a sidebar, meeting list and document preview.

## Preview

Open `index.html` directly, or serve this folder:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Then visit http://localhost:8080. Stop the server with Ctrl+C.

## Hosting

Upload `index.html`, `styles.css`, `script.js` and the `assets` folder to any static host. There is no build command; the publish directory is this folder. Relative asset paths also support hosting under a subdirectory. No Sites registration or deployment is needed.

## Enable downloads

In `script.js`, set `DOWNLOAD_URL` to your public HTTPS release URL or a relative path such as `downloads/Wallfly-AI.dmg`. For a relative download, upload the DMG at that path too. Until configured, the page shows “Mac download coming soon”. Test the release link before publishing. Browsers may ignore the download attribute for external URLs.

The current macOS 26 minimum comes from the app's Swift package. Review it when publishing a release. The product name is supplied by the owner; trademark and domain availability have not been checked.

## Demo and accessibility

The demo opens on Enhanced Notes, matching the app's document preview. My Notes, Enhanced Notes and Transcript are interactive tabs; Arrow keys wrap through all three, and Home/End select the first/last tab. Fictional transcript excerpts cycle in the Transcript view. “Pause demo” stops transcript updates. Reduced-motion preferences disable automatic playback by default; playback also waits while the page is hidden or focus is inside the demo. On narrow screens the document preview fills the demo, while the sidebar and meeting list are hidden. No real meeting content from the reference screenshot is included.

## Product copy

The app is free and open source, with no Wallfly subscription; optional API services can charge usage fees. Meeting files are stored locally. Fully local processing requires local OpenWhispr transcription and a local OpenAI-compatible enhancement model; initial model downloads require connectivity. Choosing a cloud provider sends relevant audio or text to that provider. The landing page itself makes no external requests.

## Icons

The three benefit icons (mic, hard-drive and key-round) are inline SVGs from [Lucide](https://lucide.dev), styled to match the page. Their license is included in `assets/lucide-LICENSE.txt`. No icon CDN or runtime dependency is used.

The compatibility strip uses locally stored, unmodified brand assets: the Teams SVG from [Microsoft's Teams page](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software), the Meet SVG from [Google's Meet page](https://workspace.google.com/products/meet/), and the Zoom wordmark PNG from [Zoom's media kit](https://www.zoom.com/en/about/media-kit/). These marks belong to their respective owners. The page makes no external requests to load them.
