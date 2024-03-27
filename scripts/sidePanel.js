document.querySelector("#article-summary__button--summarize").addEventListener("click", summarizeArticle);
document.querySelector("#article-summary__button--option").addEventListener("click", openOptionsPage);

function summarizeArticle() {
  chrome.runtime.sendMessage({ action: "fetchPageData" }, function (response) {
    if (response.summary) {
      document.querySelector("#article-summary__content").innerHTML = formatTextToHTML(response.summary);
    } else {
      console.error("Failed to fetch summary:", response.error);
    }
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
