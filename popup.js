document.addEventListener("DOMContentLoaded", function () {
  let toggleSwitch = document.getElementById("toggleSwitch");

  // Load the stored toggle state
  chrome.storage.sync.get("extensionEnabled", function (data) {
    toggleSwitch.checked = data.extensionEnabled ?? true;
  });

  // Handle toggle change
  toggleSwitch.addEventListener("change", function () {
    let enabled = toggleSwitch.checked;
    chrome.storage.sync.set({ extensionEnabled: enabled }, function () {
      console.log("Extension state set to:", enabled);
    });

    // Reload active Canva tabs to apply changes
    chrome.tabs.query({ url: "*://*.canva.com/*" }, function (tabs) {
      tabs.forEach((tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      });
    });
  });
});
