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
