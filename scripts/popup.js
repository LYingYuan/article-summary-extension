document.querySelector("#open-panel").addEventListener("click", function () {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));
});
