// popup.js
const toggleBtn = document.getElementById('toggle');

toggleBtn.onclick = async function() {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: (fontUrl) => {
      // Check if style is already injected
      const styleId = 'dyslexic-font-style';
      let style = document.getElementById(styleId);
      if (style) {
        style.remove();
        return false; // Font removed
      } else {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @font-face {
            font-family: 'OpenDyslexic';
            src: url('${fontUrl}') format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          body, * {
            font-family: 'OpenDyslexic', Arial, sans-serif !important;
            letter-spacing: 0.08em !important;
            line-height: 1.5 !important;
          }
        `;
        document.head.appendChild(style);
        return true; // Font applied
      }
    },
    args: [chrome.runtime.getURL("OpenDyslexic-Regular.otf")]
  }, (injectionResults) => {
    // Update button text based on result
    if (injectionResults && injectionResults[0] && injectionResults[0].result === true) {
      toggleBtn.textContent = "Restore Original Font";
    } else {
      toggleBtn.textContent = "Apply Dyslexic Font";
    }
  });
};

document.getElementById('focus').onclick = async function() {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  // Toggle focus mode: send a script that toggles a flag on the page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: () => {
      // Use a global variable to track focus mode state
      if (!window.__focusModeOn) {
        // Hide distractions
        document.querySelectorAll('img, video, iframe').forEach(el => el.style.display = 'none');
        document.querySelectorAll('aside, nav, header, footer, .sidebar, .ad, [role="banner"], [role="navigation"], [role="complementary"]').forEach(el => el.style.display = 'none');
        let main = document.querySelector('main') || document.body;
        main.style.maxWidth = '800px';
        main.style.margin = 'auto';
        main.style.background = '#fafafaff';
        main.style.boxShadow = '0 0 10px #ccc';
        window.__focusModeOn = true;
      } else {
        // Restore distractions
        document.querySelectorAll('img, video, iframe').forEach(el => el.style.display = '');
        document.querySelectorAll('aside, nav, header, footer, .sidebar, .ad, [role="banner"], [role="navigation"], [role="complementary"]').forEach(el => el.style.display = '');
        let main = document.querySelector('main') || document.body;
        main.style.maxWidth = '';
        main.style.margin = '';
        main.style.background = '';
        main.style.boxShadow = '';
        window.__focusModeOn = false;
      }
    }
  });

  // Toggle button text
  const btn = document.getElementById('focus');
  btn.textContent = btn.textContent.includes('On') ? 'Focus Mode: Off' : 'Focus Mode: On';
};