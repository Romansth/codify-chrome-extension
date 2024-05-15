import utils from "../shared/utils";
import contentStyle from "./content-style";

let lastSelectedText = "";  

document.addEventListener('mouseup', function(e: MouseEvent) {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || ""; 

    if (selection && !selection.isCollapsed && selectedText && selectedText !== lastSelectedText) {
        const anchorNode = selection.anchorNode;

        if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
            const language = utils.detectLanguageFromElement(anchorNode.parentElement!);
            if (language) {
                showTooltip(e.clientX, e.clientY, selectedText, language);
                lastSelectedText = selectedText;  
            } else {
                console.error('No programming language detected.');
                hideTooltip();  
            }
        }
    } else if (selectedText.length === 0) {
        lastSelectedText = "";  
    }
});

const createTooltipContainer = (x: number, y: number): HTMLElement => {
    let tooltipContainer = document.getElementById('extension-tooltip-container');
    if (tooltipContainer) {
        tooltipContainer.remove();
    }

    tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'extension-tooltip-container';
    document.body.appendChild(tooltipContainer);
    contentStyle.styleContainer(tooltipContainer, x, y);

    return tooltipContainer;
}

const showTooltip = (x: number, y: number, selectedText: string, tags: string) => {
    let tooltipContainer = createTooltipContainer(x, y);

    // Create saveBookmark button
    const saveBookmark = document.createElement('button');
    saveBookmark.textContent = 'Save as bookmark';
    saveBookmark.id = 'save-bookmark';
    contentStyle.styleButton(saveBookmark);
    tooltipContainer.appendChild(saveBookmark);

    // Create generateLink button
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Link';
    generateButton.id = 'generate-link';
    contentStyle.styleButton(generateButton);
    tooltipContainer.appendChild(generateButton);

      // Create title input
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.placeholder = 'Title';
      contentStyle.styleTitle(titleInput);

    // Create saveBookmark2 button
    const saveBookmark2 = document.createElement('button');
    saveBookmark2.textContent = 'Save as bookmark';
    saveBookmark2.id = 'save-bookmark2';
    contentStyle.styleButton(saveBookmark2);

    generateButton.onclick = () => {
        chrome.runtime.sendMessage({ type: "generate_link", text: selectedText }, (response) => {
            saveBookmark.style.display = 'none';
            if (response.link) {
                generateButton.style.display = 'none';

                // Display the link and the Copy Link' button
                const linkText = document.createElement('span');
                linkText.textContent = response.link; 
                linkText.style.color = '#4CAF50'; 
                tooltipContainer.appendChild(linkText);

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy Link';
                contentStyle.styleButton(copyButton);
                tooltipContainer.appendChild(copyButton);

                copyButton.onclick = function() {
                    navigator.clipboard.writeText(response.link).then(() => {
                    }).catch(err => {
                        console.error('Error copying link to clipboard:', err);
                    });
                };
            } else {
                alert('Failed to generate link.');
            }
        });
    };

    saveBookmark.onclick = () => {
        generateButton.style.display = 'none';
        saveBookmark.style.display = 'none';
        tooltipContainer.appendChild(titleInput);
        tooltipContainer.appendChild(saveBookmark2);

        saveBookmark2.onclick = () => {
            const title = titleInput.value;

            if (title && selectedText && tags) {
                const snippetData = { title: title, text: selectedText, tags: tags };
                const key = `snippet_${Date.now()}`; 
                chrome.storage.local.set({ [key]: snippetData }, () => {
                    });
                titleInput.value = '';
                hideTooltip()
                }
            else{
                console.error("No language detected")
            }
        };
    };


    setTimeout(() => {
        if (tooltipContainer) tooltipContainer.remove();
    }, 7000);
}

const hideTooltip = () => {
    const tooltip = document.getElementById('extension-tooltip-container');
    if (tooltip) {
        tooltip.remove();
    }
}
