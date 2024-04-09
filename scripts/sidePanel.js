document.querySelector("#article-summary__button--summarize").addEventListener("click", summarizeArticle);
document.querySelector("#article-summary__button--option").addEventListener("click", openOptionsPage);

function summarizeArticle() {
  showLoading();
  chrome.runtime.sendMessage({ action: "fetchPageData" }, function (response) {
    if (response.summary) {
      document.querySelector("#article-summary__content").innerHTML = formatTextToHTML(response.summary);
    } else {
      console.error("Failed to fetch summary:", response.error);
    }
    hideLoading();
  });
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

function formatTextToHTML(text) {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
  formattedText = formattedText.replace(/\n/g, `<br>`);

  return formattedText;
}

function showLoading() {
  document.querySelector("#article-summary__loading").className = "article-summary__loading-visible";
  document.querySelector("#article-summary__content").innerHTML = "";
}

function hideLoading() {
  document.querySelector("#article-summary__loading").className = "article-summary__loading-hidden";
}
