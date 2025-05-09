// Tooltip functionality for Poster Showcase (mirrored from Card Lab)
document.addEventListener('DOMContentLoaded', function() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);

  let tooltipTimer = null;

  // Add info buttons to all collapsible headers
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

  // Tooltip text for each section (customized for Poster Showcase)
  const tooltipMap = {
    'API Search': 'Connect to the Mediux API to fetch poster, album art, and titlecard sets for a show. Enter a Show ID and click Connect to begin.',
    'Creator Info': 'Add your creator name and upload a custom icon. The footer label can be used to add a set ID or other identifying text to your export.',
    'Upload Files': 'Upload your posters, album art, titlecards, and clear logos here. Adjust the logo scale as needed.',
    'Layout Options': 'Control how many items appear per row for posters, album art, and titlecards. Toggle section headers for each type.',
    'Background Options': 'Upload a custom backdrop image, adjust blur, and set gradient colors for the background. Toggle backdrop usage as needed.'
  };

  collapsibleHeaders.forEach(header => {
    // Find the h3 title
    const headerTitle = header.querySelector('h3');
    if (!headerTitle) return;
    // Use the h3 text to look up tooltip text
    const tooltipText = tooltipMap[headerTitle.textContent.trim()];
    if (tooltipText) {
      // Create info button
      const infoButton = document.createElement('span');
      infoButton.className = 'info-button';
      infoButton.innerText = '?';
      infoButton.setAttribute('aria-label', 'Information about this section');
      infoButton.setAttribute('role', 'button');
      headerTitle.appendChild(infoButton);

      infoButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          tooltipTimer = null;
        }
        if (tooltip.style.visibility === 'visible' && tooltip.dataset.currentButton === headerTitle.textContent.trim()) {
          hideTooltip();
          return;
        }
        hideTooltip(false);
        setTimeout(() => {
          tooltip.textContent = tooltipText;
          tooltip.style.opacity = 1;
          tooltip.style.visibility = 'visible';
          tooltip.dataset.currentButton = headerTitle.textContent.trim();
          positionTooltip(tooltip, infoButton);
          tooltipTimer = setTimeout(() => {
            hideTooltip();
          }, 8000);
        }, 10);
      });
      infoButton.addEventListener('mouseenter', function() {
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          tooltipTimer = null;
        }
      });
      infoButton.addEventListener('mouseleave', function() {
        if (tooltip.style.visibility === 'visible' && tooltip.dataset.currentButton === headerTitle.textContent.trim()) {
          tooltipTimer = setTimeout(() => {
            hideTooltip();
          }, 2000);
        }
      });
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.info-button') && tooltip.style.visibility === 'visible') {
      hideTooltip();
    }
  });

  function positionTooltip(tooltip, button) {
    const rect = button.getBoundingClientRect();
    const sidebar = document.querySelector('.sidebar');
    const sidebarWidth = sidebar ? sidebar.offsetWidth : window.innerWidth;
    const windowHeight = window.innerHeight;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const buttonCenterX = rect.left + (rect.width / 2);
    let leftPos = buttonCenterX - (tooltipWidth / 2);
    leftPos = Math.max(10, Math.min(leftPos, sidebarWidth - tooltipWidth - 10));
    const spaceAbove = rect.top > tooltipHeight + 15;
    let topPos;
    if (spaceAbove) {
      const verticalOffset = tooltipHeight > 100 ? 15 : 10;
      topPos = rect.top - tooltipHeight - verticalOffset;
      tooltip.classList.remove('tooltip-bottom');
      tooltip.classList.add('tooltip-top');
    } else {
      topPos = rect.bottom + 15;
      tooltip.classList.remove('tooltip-top');
      tooltip.classList.add('tooltip-bottom');
    }
    if (topPos < 10) topPos = 10;
    if (topPos + tooltipHeight > windowHeight - 10) {
      topPos = windowHeight - tooltipHeight - 10;
    }
    tooltip.style.left = `${leftPos}px`;
    tooltip.style.top = `${topPos}px`;
  }

  function hideTooltip(animate = true) {
    if (animate) {
      tooltip.style.opacity = 0;
      setTimeout(() => {
        tooltip.style.visibility = 'hidden';
      }, 300);
    } else {
      tooltip.style.opacity = 0;
      tooltip.style.visibility = 'hidden';
    }
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
      tooltipTimer = null;
    }
  }
});
