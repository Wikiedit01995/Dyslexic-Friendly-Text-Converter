// popup.js
document.getElementById('convert').onclick = async function() {
  // Get the active tab
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  // Inject script to change font to OpenDyslexic
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      // Inject OpenDyslexic font from CDN
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@latest/otf/OpenDyslexic-Regular.otf';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Apply font styles
      document.body.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
      document.body.style.letterSpacing = '0.1em';
      document.body.style.lineHeight = '1.5';
    }
  });
};