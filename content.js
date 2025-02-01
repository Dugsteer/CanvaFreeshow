// ✅ Restore normal console.log functionality
console.log = function (x) {
  window.originalConsoleLog ? window.originalConsoleLog(x) : console.info(x);
};

// ✅ Function to hide elements containing "Pro" or "Paid" (with or without SVGs)
function hideDivsWithProOrPaid() {
  document.querySelectorAll("div").forEach((div) => {
    let hasSvg = div.querySelector("svg") !== null;
    let hasPro = div.innerText.includes("Pro");
    let hasPaid = div.innerText.includes("Paid");

    // 🔹 Hide if it contains either "Pro" or "Paid" (with or without SVG)
    if (hasPro || hasPaid) {
      let parentDiv = div;

      // Stop at reasonable div sizes (prevent hiding entire page)
      while (parentDiv && parentDiv.tagName === "DIV") {
        if (parentDiv.clientHeight > 50 && parentDiv.clientHeight < 600) {
          break;
        }
        parentDiv = parentDiv.parentElement;
      }

      if (parentDiv && parentDiv.tagName === "DIV") {
        console.log("Hiding div:", parentDiv);
        parentDiv.style.display = "none";
      }
    }
  });
}

// ✅ Run script only if enabled
chrome.storage.sync.get("extensionEnabled", function (data) {
  if (data.extensionEnabled) {
    hideDivsWithProOrPaid();

    // ✅ MutationObserver for dynamically loaded elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          hideDivsWithProOrPaid();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
