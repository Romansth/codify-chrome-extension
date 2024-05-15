function createPaste(apiKey: string, pasteText: string) {
  const apiURL = "https://pastebin.com/api/api_post.php";
  const formData = new URLSearchParams();

  formData.append("api_dev_key", apiKey);
  formData.append("api_option", "paste");
  formData.append("api_paste_code", pasteText);

  return fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  })
    .then((response) => response.text())
    .then((text) => {
      if (text.startsWith("https://")) {
        return text;
      } else {
        throw new Error("Pastebin API error: " + text);
      }
    })
    .catch((error) => {
      console.error("Error creating paste:", error);
      throw error;
    });
}

const copytoClipboard = (pastelink: string) => {
  return () => {
    navigator.clipboard
      .writeText(pastelink)
      .then(() => {})
      .catch((err) => {
        console.error("Error copying link to clipboard:", err);
      });
  };
}

const languageKeywords: { [key: string]: string[] } = {
  python: ["print", "def", "import", "lambda", "self"],
  javascript: [
    "console.log",
    "function",
    "const",
    "let",
    "var",
    "document",
    "window",
  ],
  java: ["System.out.println", "public", "class", "void", "static"],
  csharp: ["Console.WriteLine", "using", "namespace", "class", "public"],
  ruby: ["puts", "def", "end", "class", "module"],
  php: ["echo", "$", "->", "function", "class"],
  go: ["fmt.Println", "func", "package", "import", "var"],
  rust: ["fn", "let", "mut", "println!", "pub"],
};

const detectLanguageFromElement = (node: Node): string | null => {
  // Traversing up the DOM to find a parent element with a language class
  while (node && node !== document.body) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (element.tagName === "CODE" || element.tagName === "PRE") {
        const classList = element.className.split(/\s+/);
        const langClass = classList.find((cls) => cls.startsWith("language-"));
        if (langClass) {
          return langClass.replace("language-", "");
        }
      }
    }
    node = node.parentNode || document.body;
  }

  // If no language class is found, use keyword-based classification
  return detectLanguageByKeywords(node.textContent || "");
}

const detectLanguageByKeywords = (text: string): string | null => {
  for (const [language, keywords] of Object.entries(languageKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return language;
      }
    }
  }
  return null;
}

export default {
  createPaste,
  copytoClipboard,
  detectLanguageFromElement,
  detectLanguageByKeywords,
};
