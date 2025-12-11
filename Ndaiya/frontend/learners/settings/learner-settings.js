document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Learner Settings: Ultra-responsive mode active');

  // ===== DOM Elements =====
  const navTabs = document.querySelectorAll('.nav-tab');
  const mobileTabSelect = document.getElementById('mobile-tab-select');
  const sections = document.querySelectorAll('.settings-section');
  const chips = document.querySelectorAll('.chip:not(.add)');
  const radioItems = document.querySelectorAll('.radio-item');

  // ===== Tab Activation =====
  function activateTab(targetId) {
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Update URL hash for deep linking
      history.pushState(null, '', `#${targetId}`);
    }
    
    // Update desktop tabs
    navTabs.forEach(tab => 
      tab.classList.toggle('active', tab.dataset.target === targetId)
    );
    
    // Update mobile selector
    if (mobileTabSelect) {
      mobileTabSelect.value = targetId;
    }
    
    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ===== Desktop Tab Clicks =====
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.target);
    });
    
    // Keyboard support
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab.dataset.target);
      }
    });
  });

  // ===== Mobile Tab Selector =====
  if (mobileTabSelect) {
    mobileTabSelect.addEventListener('change', () => {
      activateTab(mobileTabSelect.value);
    });
  }

  // ===== Chip Toggle =====
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', chip.classList.contains('active'));
    });
  });

  // ===== Radio Item Selection =====
  radioItems.forEach(item => {
    item.addEventListener('click', () => {
      const input = item.querySelector('input');
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('change'));
      }
    });
  });

  // ===== Initial State =====
  // Check URL hash for deep linking
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash)) {
    activateTab(hash);
  } else {
    // Default to first section
    if (sections[0]) {
      sections[0].classList.add('active');
      if (navTabs[0]) navTabs[0].classList.add('active');
      if (mobileTabSelect) mobileTabSelect.value = sections[0].id;
    }
  }

  // ===== Data Saver Mode =====
  const dataSaverSelect = document.getElementById('data-saver');
  if (dataSaverSelect) {
    dataSaverSelect.addEventListener('change', () => {
      if (dataSaverSelect.value === 'high') {
        // Show warning for high data saver
        if (confirm('💡 High Data Saver Mode:\n• Videos disabled\n• Images in grayscale\n• Audio only for lessons\n\nContinue?')) {
          // In real app: apply data saver settings
          console.log('Data saver set to HIGH');
        } else {
          dataSaverSelect.value = 'medium';
        }
      }
    });
  }

  // ===== Viewport Change Handling =====
  function handleViewportChange() {
    const isMobile = window.innerWidth < 528;
    
    // Focus first input when section changes on mobile
    if (isMobile) {
      const activeSection = document.querySelector('.settings-section.active');
      if (activeSection) {
        const firstInput = activeSection.querySelector('input, select, textarea, button');
        if (firstInput) {
          // Don't focus on mobile to prevent zoom
          // firstInput.focus({ preventScroll: true });
        }
      }
    }
  }

  // Initial check
  handleViewportChange();
  
  // Listen for resize
  window.addEventListener('resize', handleViewportChange);
  
  // Handle back button (hash changes)
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      activateTab(hash);
    }
  });

  console.log('✅ Settings fully initialized');
});