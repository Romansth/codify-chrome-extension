import React, { useEffect, useState } from "react";
import "./app.css";
import utils from "../../shared/utils";

type Snippet = {
  key: string;
  title: string;
  category: string;
  isOpen: boolean;
  details: string;
};

const App = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [recentSnippets, setrecentSnippets] = useState<Snippet[]>([]);
  const [allSnippetsVisible, setAllSnippetsVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    if (searchInput) {
      const results = snippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          snippet.category.toLowerCase().includes(searchInput.toLowerCase()) ||
          snippet.details.toLowerCase().includes(searchInput.toLowerCase())
      );

      setFilteredSnippets(results);
    } else {
      setFilteredSnippets([]);
    }
  }, [searchInput, snippets]);

  useEffect(() => {
    // load snippets from Chrome's local storage
    const loadSnippets = () => {
      chrome.storage.local.get(null, (result) => {
        const allSnippets: Snippet[] = [];
        for (const key in result) {
          const snippet = result[key];
          if (snippet && snippet.title && snippet.text && snippet.tags) {
            allSnippets.push({
              key: key,
              title: snippet.title,
              category: snippet.tags,
              isOpen: false,
              details: snippet.text,
            });
          }
        }
        setSnippets(allSnippets);
        if (allSnippets.length > 2) {
          setrecentSnippets(allSnippets.slice(-3));
        } else {
          setrecentSnippets(allSnippets);
        }
      });
    };

    loadSnippets();
  }, []);

  const toggleAllSnippet = (index: number) => {
    //allsnippet toggle for titles
    setSnippets((prevSnippets) =>
      prevSnippets.map((snippet, i) =>
        i === index ? { ...snippet, isOpen: !snippet.isOpen } : snippet
      )
    );
  };

  const toggleRecentSnippet = (index: number) => {
    //recent snippet toggle for titles
    setrecentSnippets((prevSnippets) =>
      prevSnippets.map((snippet, i) =>
        i === index ? { ...snippet, isOpen: !snippet.isOpen } : snippet
      )
    );
  };

  const toggleFilteredSnippet = (index: number) => {
    //recent snippet toggle for titles
    setFilteredSnippets((prevSnippets) =>
      prevSnippets.map((snippet, i) =>
        i === index ? { ...snippet, isOpen: !snippet.isOpen } : snippet
      )
    );
  };

  const toggleSnippetBox = () => {
    //toggle for add snippet
    const snippetBox = document.querySelector(".add-snippet") as HTMLElement;
    if (
      snippetBox.style.display === "none" ||
      snippetBox.style.display === ""
    ) {
      snippetBox.style.display = "flex";
    } else {
      snippetBox.style.display = "none";
    }
  };
  const toggleAllSnippetBox = () => {
    //allsnippet overall toggle
    setAllSnippetsVisible(!allSnippetsVisible);
  };

  const saveSnippet = () => {
    //saves snippet to chrome local
    const titlearea = document.getElementById(
      "snippetTextTitlearea"
    ) as HTMLTextAreaElement;
    const textarea = document.getElementById(
      "snippetTextarea"
    ) as HTMLTextAreaElement;
    const snippet = textarea.value;
    const snippetTitle = titlearea.value;
    const language = utils.detectLanguageByKeywords(snippet);
    if (snippet && snippetTitle && language) {
      const snippetData = {
        title: snippetTitle,
        text: snippet,
        tags: language,
      };
      const key = `snippet_${Date.now()}`; // Unique key for each snippet
      chrome.storage.local.set({ [key]: snippetData }, () => {
        console.log(`Saved snippet: ${snippetTitle}`);
      });

      if (snippet.trim() !== "") {
        const messageDiv = document.getElementById("message");
        if (messageDiv) {
          messageDiv.style.display = "block";
        }
        textarea.value = "";
        titlearea.value = "";
        setTimeout(() => {
          if (messageDiv) {
            messageDiv.style.display = "none";
          }
        }, 2000);
      }
    } else {
      const invalidmessageDiv = document.getElementById("invalid-message");
      if (invalidmessageDiv) {
        invalidmessageDiv.style.display = "block";
      }

      setTimeout(() => {
        if (invalidmessageDiv) {
          invalidmessageDiv.style.display = "none";
        }
      }, 2000);
      console.error("No language detected");
    }
  };

  const deleteSnippet = (key: string) => {
    chrome.storage.local.remove(key, () => {
      const deletemessageDiv = document.getElementById("delete-message");
      if (deletemessageDiv) {
        deletemessageDiv.style.display = "block";
      }
      setTimeout(() => {
        if (deletemessageDiv) {
          deletemessageDiv.style.display = "none";
        }
        const deletedMessage = document.getElementById(key);
        deletedMessage?.remove();
      }, 2000);

      if (chrome.runtime.lastError) {
        console.error(`Error removing snippet: ${chrome.runtime.lastError}`);
      }
    });
  };

  const createSnippetLink = (text: string) => {
    chrome.runtime.sendMessage(
      { type: "generate_link", text: text },
      function (response) {
        navigator.clipboard
          .writeText(response.link)
          .then(() => {})
          .catch((err) => {
            console.error("Error copying link to clipboard:", err);
          });

        const copiedDiv = document.getElementById("copy-message");
        if (copiedDiv) {
          copiedDiv.style.display = "block";
        }
        setTimeout(() => {
          if (copiedDiv) {
            copiedDiv.style.display = "none";
          }
        }, 2000);
      }
    );
  };

  return (
    <div className="App">
      <div className="dashboard">
        <div className="header">
          <h1>Codify: Code Snippet Manager</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search snippets..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {filteredSnippets.length > 0 && (
          <div className="search-results">
            <div className="search-success">Search results:</div>

            {filteredSnippets.map((filteredSnippet, index) => (
              <div
                key={index}
                className={`snippet-item ${
                  filteredSnippet.isOpen ? "open" : ""
                }`}
                id={filteredSnippet.key}
              >
                <div
                  className="snippet-header"
                  onClick={() => toggleFilteredSnippet(index)}
                >
                  <span>{filteredSnippet.title}</span>
                  <span className="status category">
                    {filteredSnippet.category}
                  </span>
                </div>
                {filteredSnippet.isOpen && (
                  <div className="snippet-details">
                    <pre>{filteredSnippet.details}</pre>
                    <button
                      className="copy-link-btn"
                      onClick={() => createSnippetLink(filteredSnippet.details)}
                    >
                      Copy Link
                    </button>
                    <button
                      className="delete-link-btn"
                      onClick={() => deleteSnippet(filteredSnippet.key)}
                    >
                      Delete Snippet
                    </button>
                    <div id="copy-message" className="snippet-success">
                      Link copied to clipboard!
                    </div>
                    <div id="delete-message" className="snippet-delete">
                      Snippet deleted!
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-item" onClick={() => toggleSnippetBox()}>
            <span>➕ Add New Snippet</span>
          </div>
          <div className="add-snippet">
            <textarea id="snippetTextTitlearea" placeholder="Title"></textarea>
            <textarea
              id="snippetTextarea"
              placeholder="Paste your snippet here"
            ></textarea>
            <button className="copy-link-btn" onClick={() => saveSnippet()}>
              Add snippet
            </button>
          </div>
          <div id="message" className="snippet-success">
            Snippet saved!
          </div>
          <div id="invalid-message" className="snippet-delete">
            Invalid input or not a code!
          </div>
        </div>
        <div className="recent-snippets">
          <h3>Recent Snippets</h3>
          {recentSnippets.map((recentSnippet, index) => (
            <div
              key={index}
              className={`snippet-item ${recentSnippet.isOpen ? "open" : ""}`}
              id={recentSnippet.key}
            >
              <div
                className="snippet-header"
                onClick={() => toggleRecentSnippet(index)}
              >
                <span>{recentSnippet.title}</span>
                <span className="status category">
                  {recentSnippet.category}
                </span>
              </div>
              {recentSnippet.isOpen && (
                <div className="snippet-details">
                  <pre>{recentSnippet.details}</pre>
                  <button
                    className="copy-link-btn"
                    onClick={() => createSnippetLink(recentSnippet.details)}
                  >
                    Copy Link
                  </button>
                  <button
                    className="delete-link-btn"
                    onClick={() => deleteSnippet(recentSnippet.key)}
                  >
                    Delete Snippet
                  </button>
                  <div id="copy-message" className="snippet-success">
                    Link copied to clipboard!
                  </div>
                  <div id="delete-message" className="snippet-delete">
                    Snippet deleted!
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="quick-menu">
          <h3>Quick Menu</h3>
          <div className="all-snippets">
            <div className="menu-item" onClick={toggleAllSnippetBox}>
              📂 All Snippets
            </div>
            {allSnippetsVisible && (
              <div className="all-snippets-toggle">
                {snippets.map((snippet, index) => (
                  <div
                    key={index}
                    className={`snippet-item ${snippet.isOpen ? "open" : ""}`}
                    id={snippet.key}
                  >
                    <div
                      className="snippet-header"
                      onClick={() => toggleAllSnippet(index)}
                    >
                      <span>{snippet.title}</span>
                      <span className="status category">
                        {snippet.category}
                      </span>
                    </div>
                    {snippet.isOpen && (
                      <div className="snippet-details">
                        <pre>{snippet.details}</pre>
                        <button
                          className="copy-link-btn"
                          onClick={() => createSnippetLink(snippet.details)}
                        >
                          Copy Link
                        </button>
                        <button
                          className="delete-link-btn"
                          onClick={() => deleteSnippet(snippet.key)}
                        >
                          Delete Snippet
                        </button>
                        <div id="copy-message" className="snippet-success">
                          Link copied to clipboard!
                        </div>
                        <div id="delete-message" className="snippet-delete">
                          Snippet deleted!
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* <div className="menu-item">📑 Categories</div> */}
          {/* <div className="menu-item">⚙️ Settings</div>
          <div className="menu-item">🔗 GitHub/GitLab Integration</div> */}
        </div>
        <div className="navigation">
          <div>↑↓ to navigate</div>
          <div>↵ to select</div>
        </div>
      </div>
    </div>
  );
}

export default App;
