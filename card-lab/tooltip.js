// Tooltip functionality with enhanced user experience
document.addEventListener('DOMContentLoaded', function() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);
  
  // Track tooltip visibility timer
  let tooltipTimer = null;
  
  // Add info buttons to all collapsible headers
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  
  collapsibleHeaders.forEach(header => {
    // Get tooltip text from data attribute
    const tooltipText = header.getAttribute('data-tooltip');
    if (tooltipText) {
      // Create info button
      const infoButton = document.createElement('span');
      infoButton.className = 'info-button';
      infoButton.innerText = '?';
      infoButton.setAttribute('aria-label', 'Information about this section');
      infoButton.setAttribute('role', 'button');
      
      // Insert the info button after the header title
      const headerTitle = header.querySelector('h3');
      headerTitle.appendChild(infoButton);
      
      // Add click event to show/hide tooltip
      infoButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the collapsible toggle
        
        // Clear any existing timer
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          tooltipTimer = null;
        }
        
        // If tooltip is already visible for this button, hide it
        if (tooltip.style.visibility === 'visible' && tooltip.dataset.currentButton === header.id) {
          hideTooltip();
          return;
        }
        
        // Hide any existing tooltips
        hideTooltip(false);
        
        // Show tooltip with this button's text
        setTimeout(() => {
          tooltip.textContent = tooltipText;
          tooltip.style.opacity = 1;
          tooltip.style.visibility = 'visible';
          tooltip.dataset.currentButton = header.id;
          
          // Position the tooltip
          positionTooltip(tooltip, infoButton);
          
          // Auto-hide tooltip after a longer duration for better readability
          tooltipTimer = setTimeout(() => {
            hideTooltip();
          }, 8000); // 8 seconds to read the longer detailed descriptions
        }, 10);
      });
      
      // Mouse enter - clear the auto-hide timer to keep tooltip visible while hovering
      infoButton.addEventListener('mouseenter', function() {
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          tooltipTimer = null;
        }
      });
      
      // Mouse leave - set timer to hide tooltip after delay
      infoButton.addEventListener('mouseleave', function() {
        if (tooltip.style.visibility === 'visible' && tooltip.dataset.currentButton === header.id) {
          tooltipTimer = setTimeout(() => {
            hideTooltip();
          }, 2000); // 2 second delay after mouse leaves
        }
      });
    }
  });
  
  // Hide tooltip when clicking anywhere outside the info button
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.info-button') && tooltip.style.visibility === 'visible') {
      hideTooltip();
    }
  });
  
  // Position tooltip above or below the info button based on available space
  function positionTooltip(tooltip, button) {
    const rect = button.getBoundingClientRect();
    const sidebarWidth = document.querySelector('.sidebar').offsetWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate tooltip position
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const buttonCenterX = rect.left + (rect.width / 2);
    
    // Center tooltip above button
    let leftPos = buttonCenterX - (tooltipWidth / 2);
    
    // Ensure tooltip stays within sidebar
    leftPos = Math.max(10, Math.min(leftPos, sidebarWidth - tooltipWidth - 10));
      // Determine if there's enough space above
    const spaceAbove = rect.top > tooltipHeight + 15;
    let topPos;
    
    if (spaceAbove) {
      // Position above with appropriate offset based on content length
      const verticalOffset = tooltipHeight > 100 ? 15 : 10;
      topPos = rect.top - tooltipHeight - verticalOffset;
      
      // Make sure arrow points down
      tooltip.classList.remove('tooltip-bottom');
      tooltip.classList.add('tooltip-top');
    } else {
      // Position below with appropriate offset
      topPos = rect.bottom + 15;
      
      // Make sure arrow points up - critical for correct arrow direction
      tooltip.classList.remove('tooltip-top');
      tooltip.classList.add('tooltip-bottom');
    }
    
    // Ensure tooltip is fully visible in viewport
    if (topPos < 10) topPos = 10;
    if (topPos + tooltipHeight > windowHeight - 10) {
      topPos = windowHeight - tooltipHeight - 10;
    }
    
    tooltip.style.left = `${leftPos}px`;
    tooltip.style.top = `${topPos}px`;
  }
  
  // Helper function to hide tooltip
  function hideTooltip(animate = true) {
    if (animate) {
      tooltip.style.opacity = 0;
      setTimeout(() => {
        tooltip.style.visibility = 'hidden';
      }, 300); // Match the CSS transition duration
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
