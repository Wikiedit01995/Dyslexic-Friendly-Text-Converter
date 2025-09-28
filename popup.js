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