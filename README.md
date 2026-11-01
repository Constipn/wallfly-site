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

## Enable downloads and GitHub links

At the top of `script.js` there are two settings:

- `DOWNLOAD_URL`: your public HTTPS release URL or a relative path such as `downloads/Wallfly-AI.dmg`. For a relative download, upload the DMG at that path too. Until configured, the hero and the download section show “Mac download coming soon”. Test the release link before publishing. Browsers may ignore the download attribute for external URLs.
- `GITHUB_URL`: your public repository URL. Until configured, all GitHub links (navigation, hero, download section, footer) stay hidden. If `GITHUB_URL` is set but `DOWNLOAD_URL` is not, the GitHub button becomes the main button.

Before going public, add Impressum and privacy policy links to the footer (see the TODO comment in `index.html`).

The current requirements (macOS 26 or later, Apple Silicon) come from the app's Swift package and README. Review them when publishing a release. The product name is supplied by the owner; trademark and domain availability have not been checked.

## Demo and accessibility

The demo shows the three-pane meeting overview for 2 seconds, then moves an illustrated pointer to “New Note” and clicks it. At 3.15 seconds a recording window opens over the overview, with notes being typed, a progressively appearing conversation transcript, an audio activity indicator and a recording timer. The transcript starts expanded and automatically collapses after 5.2 seconds to give the notes more room. Its heading toggles it at any time; a manual choice lasts for the current meeting. After 15 seconds in the recording view the loop starts again. All content is fictional and local; the demo does not capture audio.

New Note also opens the recording preview from the beginning on click, with notes, transcript and timer continuing to animate. A manually opened meeting stays open until dismissed. The X button, Stop recording or Escape returns to the overview and stops autoplay, so the meeting does not immediately reopen; “Play demo” starts the automatic loop again. The overview has interactive My Notes, Enhanced Notes and Transcript tabs, with Arrow keys and Home/End support. Selecting an overview tab stops autoplay. The recording window has its own interactive My Notes and Enhanced Notes tabs; Enhanced Notes explains the summary that follows the meeting. Transcript and recording-tab clicks keep the animation running. Pause preserves the current animation position. Reduced-motion preferences disable automatic playback by default; playback also waits while the page is hidden or keyboard navigation has focus inside the app window. On narrow screens the document preview fills the demo and includes a New Note button, while the sidebar and meeting list are hidden. The recording preview fits inside the app window at every screen size.

## Product copy

The page copy is platform-neutral ("stored on your computer"), because a Windows version is planned. Only the download button and availability notes name the Mac, since the current release is Mac-only. When a Windows build exists, add a second download button and update the availability notes and the "Which computers are supported?" FAQ.

The app is free and open source, with no Wallfly subscription; optional API services can charge usage fees. Meeting files are stored locally. Fully local processing requires local OpenWhispr transcription and a local OpenAI-compatible enhancement model; initial model downloads require connectivity. Choosing a cloud provider sends relevant audio or text to that provider. The landing page itself makes no external requests.

Wallfly includes implemented support for the Model Context Protocol (MCP), allowing integration with MCP-compatible AI tools and workflows. This is highlighted in the AI benefit card and FAQ.

## Icons

The four benefit icons (mic, hard-drive, code-xml and key-round) are inline SVGs from [Lucide](https://lucide.dev), styled to match the page. Their license is included in `assets/lucide-LICENSE.txt`. No icon CDN or runtime dependency is used.

The GitHub button uses the GitHub mark from [Simple Icons](https://simpleicons.org) (CC0) as an inline SVG.

The compatibility strip uses locally stored, unmodified brand assets: the Teams SVG from [Microsoft's Teams page](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software), the Meet SVG from [Google's Meet page](https://workspace.google.com/products/meet/), and the Zoom wordmark PNG from [Zoom's media kit](https://www.zoom.com/en/about/media-kit/). These marks belong to their respective owners. The page makes no external requests to load them.
