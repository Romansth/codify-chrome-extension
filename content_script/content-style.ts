function styleContainer(container: any, x: any, y: any) {
    container.style.position = 'fixed';
    container.style.left = `${x + 200}px`;
    container.style.top = `${y - 100}px`;
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column'; 
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center'; 
    container.style.gap = '10px';
    container.style.background = '#f5f5f5'; 
    container.style.border = '1px solid #d1d1d1';  
    container.style.borderRadius = '8px'; 
    container.style.padding = '10px 10px'; 
    container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';  
    container.style.fontSize = '14px';  
    container.style.fontFamily = 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'; 
    container.style.color = '#333';  
}

function styleButton(button: any) {
    button.style.padding = '8px 16px'; 
    button.style.background = '#4CAF50'; 
    button.style.border = 'none'; 
    button.style.borderRadius = '4px'; 
    button.style.cursor = 'pointer';
    button.style.color = 'white'; 
    button.style.fontSize = '14px'; 
    button.style.fontWeight = 'bold'; 
    button.style.textShadow = 'none'; 
    button.style.transition = 'background-color 0.3s ease'; 

    button.onmouseover = () => {
        button.style.backgroundColor = '#45a049'; 
    };

    button.onmouseout = () => {
        button.style.backgroundColor = '#4CAF50'; 
    };
}

function styleTitle(titleInput: any) {
    titleInput.style.padding = '8px';
    titleInput.style.borderRadius = '4px';
    titleInput.style.border = '1px solid #ccc'; 
    titleInput.style.backgroundColor = '#f5f5f5'; 
    titleInput.style.color = '#333'; 
    titleInput.style.fontSize = '14px';
    titleInput.style.fontFamily = 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'; 
    titleInput.style.outline = 'none';
}

export default { styleContainer, styleButton, styleTitle };
