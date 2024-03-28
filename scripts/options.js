document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#save").addEventListener("click", saveOptions);

function saveOptions() {
  const articleSummaryUrl = document.querySelector("#url").value;
  const articleSummaryApiKey = document.querySelector("#api-key").value;
  const articleSummaryModel = document.querySelector("#model").value;
  const articleSummaryServerApi = document.querySelector("#server-api").value;
  chrome.storage.local.set(
    {
      articleSummaryUrl,
      articleSummaryApiKey,
      articleSummaryModel,
      articleSummaryServerApi,
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
      articleSummaryServerApi: "",
    },
    function (result) {
      document.querySelector("#url").value = result.articleSummaryUrl;
      document.querySelector("#api-key").value = result.articleSummaryApiKey;
      document.querySelector("#model").value = result.articleSummaryModel;
      document.querySelector("#server-api").value = result.articleSummaryServerApi;
    }
  );
}
