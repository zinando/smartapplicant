/**
 * Shows a WhatsApp redirect dialog prompt
 * @param {string} phoneNumber - Your WhatsApp number in international format (e.g., "1234567890")
 * @param {string} [message] - Optional pre-filled message
 * @param {string} [dialogTitle] - Custom dialog title
 * @param {string} [dialogText] - Custom dialog text
 */
function showWhatsAppRedirect(phoneNumber, message = '', dialogTitle = 'Chat with Us', dialogText = 'Click below to start a conversation on WhatsApp:') {
  // Create dialog container
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.top = '0';
  dialog.style.left = '0';
  dialog.style.right = '0';
  dialog.style.bottom = '0';
  dialog.style.backgroundColor = 'rgba(0,0,0,0.5)';
  dialog.style.display = 'flex';
  dialog.style.justifyContent = 'center';
  dialog.style.alignItems = 'center';
  dialog.style.zIndex = '1000';
  
  // Create dialog box
  const dialogBox = document.createElement('div');
  dialogBox.style.backgroundColor = 'white';
  dialogBox.style.padding = '2rem';
  dialogBox.style.borderRadius = '0.5rem';
  dialogBox.style.maxWidth = '90%';
  dialogBox.style.width = '400px';
  dialogBox.style.textAlign = 'center';
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = dialogTitle;
  title.style.fontSize = '1.25rem';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '1rem';
  title.style.color = '#25D366'; // WhatsApp green
  
  // Add text
  const text = document.createElement('p');
  text.textContent = dialogText;
  text.style.marginBottom = '1.5rem';
  
  // Create WhatsApp button
  const whatsappBtn = document.createElement('button');
  whatsappBtn.textContent = 'Continue to WhatsApp';
  whatsappBtn.style.backgroundColor = '#25D366';
  whatsappBtn.style.color = 'white';
  whatsappBtn.style.padding = '0.75rem 1.5rem';
  whatsappBtn.style.borderRadius = '0.375rem';
  whatsappBtn.style.fontWeight = 'bold';
  whatsappBtn.style.border = 'none';
  whatsappBtn.style.cursor = 'pointer';
  whatsappBtn.style.transition = 'background-color 0.2s';
  
  // Hover effect
  whatsappBtn.onmouseover = () => whatsappBtn.style.backgroundColor = '#128C7E';
  whatsappBtn.onmouseout = () => whatsappBtn.style.backgroundColor = '#25D366';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Cancel';
  closeBtn.style.marginTop = '1rem';
  closeBtn.style.color = '#555';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  
  // Build dialog
  dialogBox.appendChild(title);
  dialogBox.appendChild(text);
  dialogBox.appendChild(whatsappBtn);
  dialogBox.appendChild(closeBtn);
  dialog.appendChild(dialogBox);
  document.body.appendChild(dialog);
  
  // Add click handlers
  whatsappBtn.onclick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    document.body.removeChild(dialog);
  };
  
  closeBtn.onclick = () => {
    document.body.removeChild(dialog);
  };
  
  // Close when clicking outside
  dialog.onclick = (e) => {
    if (e.target === dialog) {
      document.body.removeChild(dialog);
    }
  };
}