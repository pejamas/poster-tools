// Initialize Lucide icons
lucide.createIcons();

// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuDropdown = document.getElementById('mobile-menu-dropdown');

mobileMenuToggle.addEventListener('click', () => {
  // Toggle mobile dropdown menu
  mobileMenuDropdown.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu-dropdown a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuDropdown.classList.remove('active');
  });
});

// Close mobile menu when clicking outside of it
document.addEventListener('click', (event) => {
  if (!event.target.closest('#mobile-menu-toggle') && 
      !event.target.closest('#mobile-menu-dropdown')) {
    mobileMenuDropdown.classList.remove('active');
  }
});

// Close mobile menu when window is resized above mobile breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    mobileMenuDropdown.classList.remove('active');
  }
});

// Lightbox functionality for home page preview images
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('home-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const previewImages = document.querySelectorAll('.preview-image');
  
  // Open lightbox when clicking on a preview image
  previewImages.forEach(image => {
    image.addEventListener('click', function() {
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      lightbox.classList.add('active');
      
      // Prevent scrolling on the body when lightbox is open
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close lightbox when clicking the close button
  lightboxClose.addEventListener('click', function() {
    lightbox.classList.remove('active');
    
    // Re-enable scrolling when lightbox is closed
    document.body.style.overflow = '';
  });
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Add keyboard support for closing the lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Add subtle animation effect to preview images
  previewImages.forEach(image => {
    // Create pulsing glow effect on hover
    image.addEventListener('mouseover', function() {
      this.style.animation = 'pulse 2s infinite';
    });
    
    image.addEventListener('mouseout', function() {
      this.style.animation = '';
    });
  });
});
