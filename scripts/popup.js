document.querySelector("#summary-panel__open").addEventListener("click", openSidePanel);

function openSidePanel() {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));
}
