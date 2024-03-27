chrome.runtime.onMessage.addListener(onMessage);

function onMessage(request, sender, sendResponse) {
  if (request.action === "fetchPageData") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getPageData,
        },
        async results => {
          try {
            if (chrome.runtime.lastError || !results || results.length === 0) {
              console.error("Script execution failed", chrome.runtime.lastError);
              return;
            }
            const pageData = results[0].result;
            const summary = await sendHtmlToServer(pageData.html, pageData.url);
            sendResponse({ summary: summary });
          } catch (error) {
            console.error("Error sending HTML to server:", error);
            sendResponse({ error: "Failed to get summary" });
          }
        }
      );
    });
    // Must return true when using sendResponse for asynchronous response
    // This informs Chrome to keep the message channel open for the sendMessage callback
    return true;
  }
}

function getPageData() {
  return { html: document.documentElement.outerHTML, url: window.location.href };
}

async function sendHtmlToServer(html, articleUrl) {
  try {
    const { url, apiKey, model } = await restoreOptions();
    const res = await fetch("http://localhost:3000/api/summarize-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: articleUrl,
        llmApiConfig: {
          model,
          url,
          apiKey,
          prompt:
            "Title: [Article Title]\\n\\nBrief Introduction: [A brief introduction of the topic or background of the article]\\n\\nKey Points:\\n\\n[First key point...]\\n[Second key point...]\\n[Continue listing more key points...]\\nConclusion or Perspective: [The main conclusion or the author's perspective of the article]\\n\\nBased on the information provided above, please summarize the main content and core viewpoints of this article in Chinese.",
        },
        html: JSON.stringify(html),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const { summary } = data;
      return summary;
    } else {
      return "Error";
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

function restoreOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      {
        articleSummaryUrl: "", // default value
        articleSummaryApiKey: "",
        articleSummaryModel: "",
      },
      function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve({
            url: result.articleSummaryUrl,
            apiKey: result.articleSummaryApiKey,
            model: result.articleSummaryModel,
          });
        }
      }
    );
  });
}
