document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);

function saveOptions() {
  const articleSummaryUrl = document.querySelector("#url").value;
  const articleSummaryApiKey = document.querySelector("#apiKey").value;
  const articleSummaryModel = document.querySelector("#model").value;
  chrome.storage.local.set(
    {
      articleSummaryUrl,
      articleSummaryApiKey,
      articleSummaryModel,
    },
    function () {
      console.log("Save Successfully");
    }
  );
}

function restoreOptions() {
  chrome.storage.local.get(
    {
      articleSummaryUrl: "",
      articleSummaryApiKey: "",
      articleSummaryModel: "",
    },
    function (result) {
      document.querySelector("#url").value = result.articleSummaryUrl;
      document.querySelector("#apiKey").value = result.articleSummaryApiKey;
      document.querySelector("#model").value = result.articleSummaryModel;
    }
  );
}
