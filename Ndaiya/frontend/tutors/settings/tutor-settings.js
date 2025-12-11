document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Tutor Settings loaded');

  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.settings-section');

  // Verify IDs match
  navTabs.forEach(tab => {
    const target = tab.dataset.target;
    const section = document.getElementById(target);
    if (!section) {
      console.error(`❌ Tab "${tab.textContent}" points to missing section #${target}`);
      tab.style.outline = '2px solid red';
    }
  });

  // Activate tab and section
  function activateTab(targetId) {
    // Deactivate all
    sections.forEach(s => s.classList.remove('active'));
    navTabs.forEach(t => t.classList.remove('active'));
    
    // Activate target
    const targetSection = document.getElementById(targetId);
    const targetTab = Array.from(navTabs).find(t => t.dataset.target === targetId);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
    
    console.log(`✅ Activated: ${targetId}`);
  }

  // Bind clicks
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

  // Activate first tab by default
  if (navTabs[0]) {
    activateTab(navTabs[0].dataset.target);
  }

  // Save buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.closest('.settings-section').id;
      const msg = section === 'tutor' 
        ? '✅ Tutor preferences saved!' 
        : '✅ Profile updated!';
      alert(msg);
    });
  });
});