document.querySelector("#summarize__button").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentPageUrl = tabs[0].url;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getPageHtmlContent,
      },
      results => {
        sendHtmlToServer(results[0].result, currentPageUrl);
      }
    );
  });
});

function getPageHtmlContent() {
  return document.documentElement.outerHTML;
}

async function sendHtmlToServer(html, url) {
  try {
    const res = await fetch("http://localhost:3000/api/summarize-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        llmApiConfig: {
          model: "gpt-3.5-turbo",
          url: "",
          apiKey: "",
          prompt:
            "Title: [Article Title]\\n\\nBrief Introduction: [A brief introduction of the topic or background of the article]\\n\\nKey Points:\\n\\n[First key point...]\\n[Second key point...]\\n[Continue listing more key points...]\\nConclusion or Perspective: [The main conclusion or the author's perspective of the article]\\n\\nBased on the information provided above, please summarize the main content and core viewpoints of this article in Chinese.",
        },
        html: JSON.stringify(html),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const { summary } = data;
      document.querySelector(".summary").textContent = summary;
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
