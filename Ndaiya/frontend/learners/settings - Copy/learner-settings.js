document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Learner Settings (Zambia) loaded');

  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.settings-section');

  // Validate tab/section IDs
  navTabs.forEach(tab => {
    const target = tab.dataset.target;
    if (!document.getElementById(target)) {
      console.error(`❌ Missing section: #${target}`);
      tab.style.outline = '2px solid red';
    }
  });

  // Activate tab function
  function activateTab(targetId) {
    // Hide all sections & tabs
    sections.forEach(s => s.classList.remove('active'));
    navTabs.forEach(t => t.classList.remove('active'));
    
    // Show target
    const section = document.getElementById(targetId);
    const tab = Array.from(navTabs).find(t => t.dataset.target === targetId);
    
    if (section) section.classList.add('active');
    if (tab) tab.classList.add('active');
    
    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Bind click events
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.target));
    
    // Keyboard support
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab.dataset.target);
      }
    });
  });

  // Activate first tab
  if (navTabs[0]) {
    activateTab(navTabs[0].dataset.target);
  }

  // Save handlers
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.closest('.settings-section').id;
      const messages = {
        profile: '✅ Profile saved!',
        lessons: '✅ Lesson preferences updated!'
      };
      alert(messages[section] || '✅ Settings saved!');
    });
  });

  // Data Saver Mode warning
  const dataSaverSelect = document.getElementById('data-saver');
  if (dataSaverSelect) {
    dataSaverSelect.addEventListener('change', () => {
      if (dataSaverSelect.value === 'high') {
        alert('💡 High Data Saver Mode:\n• Videos disabled\n• Images in grayscale\n• Audio only for lessons');
      }
    });
  }

  // MTN/Airtel info on payment tab
  const paymentsTab = Array.from(navTabs).find(t => t.dataset.target === 'payments');
  if (paymentsTab) {
    paymentsTab.addEventListener('click', () => {
      setTimeout(() => {
        const firstPayment = document.querySelector('.payment-method');
        if (firstPayment) {
          firstPayment.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    });
  }
});