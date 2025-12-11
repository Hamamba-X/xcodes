document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM Elements =====
  const bookBtn = document.getElementById('btn-book-lesson');
  const postBtn = document.getElementById('btn-post-feed');
  const toggleFeedBtn = document.getElementById('btn-toggle-feed');
  const feedContainer = document.getElementById('feed-container');
  const modalBook = document.getElementById('modal-book');
  const modalPost = document.getElementById('modal-post');
  const closeModalBtn = document.getElementById('close-modal');
  const closePostModalBtn = document.getElementById('close-post-modal');
  const cancelBookingBtn = document.getElementById('cancel-booking');
  const cancelPostBtn = document.getElementById('cancel-post');
  const bookingForm = document.getElementById('booking-form');
  const postForm = document.getElementById('post-form');
  const subjectSelect = document.getElementById('subject');
  const topicSelect = document.getElementById('topic');
  const postImageInput = document.getElementById('post-image');
  const altTextInput = document.getElementById('alt-text');
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');

  // 🔒 Enforce hidden modals & feed on init
  if (modalBook) modalBook.hidden = true;
  if (modalPost) modalPost.hidden = true;
  if (feedContainer) feedContainer.hidden = true;

  // ===== Modal Control =====
  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // ===== Feed Toggle =====
  if (toggleFeedBtn && feedContainer) {
    toggleFeedBtn.addEventListener('click', () => {
      const isHidden = feedContainer.hidden;
      feedContainer.hidden = !isHidden;
      
      // Update button text/icon
      toggleFeedBtn.innerHTML = `
        <span class="icon">${isHidden ? '📌' : '📰'}</span>
        <span>${isHidden ? 'Hide Feeds' : 'Feeds'}</span>
      `;
    });
  }

  // ===== Modal Events =====
  if (bookBtn && modalBook) {
    bookBtn.addEventListener('click', () => openModal(modalBook));
  }
  if (postBtn && modalPost) {
    postBtn.addEventListener('click', () => openModal(modalPost));
  }

  // Close modals
  [closeModalBtn, cancelBookingBtn].forEach(btn => {
    if (btn && modalBook) {
      btn.addEventListener('click', () => closeModal(modalBook));
    }
  });
  [closePostModalBtn, cancelPostBtn].forEach(btn => {
    if (btn && modalPost) {
      btn.addEventListener('click', () => closeModal(modalPost));
    }
  });

  // Close on overlay click
  const overlayBook = modalBook?.querySelector('.modal-overlay');
  const overlayPost = modalPost?.querySelector('.modal-overlay');
  if (overlayBook) overlayBook.addEventListener('click', () => closeModal(modalBook));
  if (overlayPost) overlayPost.addEventListener('click', () => closeModal(modalPost));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalBook && !modalBook.hidden) closeModal(modalBook);
      if (modalPost && !modalPost.hidden) closeModal(modalPost);
      if (feedContainer && !feedContainer.hidden && e.target !== toggleFeedBtn) {
        feedContainer.hidden = true;
        toggleFeedBtn.innerHTML = '<span class="icon">📰</span><span>Feeds</span>';
      }
    }
  });

  // ===== Dropdown Toggle =====
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = userMenuBtn.getAttribute('aria-expanded') === 'true';
      userMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      userDropdown.hidden = isExpanded;
    });

    document.addEventListener('click', (e) => {
      if (
        !userMenuBtn.contains(e.target) &&
        !userDropdown.contains(e.target)
      ) {
        userMenuBtn.setAttribute('aria-expanded', 'false');
        userDropdown.hidden = true;
      }
    });
  }

  // ===== Subject → Topic Logic =====
  if (subjectSelect && topicSelect) {
    const topicsBySubject = {
      maths: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
      english: ['Grammar', 'Essay Writing', 'Comprehension', 'Literature', 'Vocabulary'],
      physics: ['Mechanics', 'Waves', 'Electricity', 'Magnetism', 'Thermodynamics'],
      ict: ['HTML/CSS', 'Python Basics', 'Spreadsheets', 'Digital Safety', 'AI Intro'],
      agri: ['Crop Production', 'Soil Science', 'Animal Husbandry', 'Sustainable Farming']
    };

    subjectSelect.addEventListener('change', function () {
      const subject = this.value;
      topicSelect.innerHTML = '<option value="">Select topic</option>';
      topicSelect.disabled = !subject;

      if (subject && topicsBySubject[subject]) {
        topicsBySubject[subject].forEach(topic => {
          const opt = document.createElement('option');
          opt.value = topic.toLowerCase().replace(/\s+/g, '-');
          opt.textContent = topic;
          topicSelect.appendChild(opt);
        });
      }
    });
  }

  // ===== Image Upload =====
  if (postImageInput && altTextInput) {
    postImageInput.addEventListener('change', () => {
      altTextInput.disabled = !postImageInput.files.length;
      if (postImageInput.files.length) altTextInput.focus();
    });
  }

  // ===== Form Submissions =====
  if (bookingForm && topicSelect) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Lesson booked successfully!');
      closeModal(modalBook);
      bookingForm.reset();
      topicSelect.disabled = true;
    });
  }

  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('post-text')?.value.trim();
      if (!text) return;

      const container = document.getElementById('feed-posts');
      if (!container) return;

      // Ensure feed is visible after posting
      if (feedContainer) {
        feedContainer.hidden = false;
        if (toggleFeedBtn) {
          toggleFeedBtn.innerHTML = '<span class="icon">📌</span><span>Hide Feeds</span>';
        }
      }

      const post = document.createElement('article');
      post.className = 'post';
      post.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">👤</div>
          <div class="post-meta">
            <strong>You</strong> • <time>Just now</time>
          </div>
        </div>
        <div class="post-content">${text.replace(/\n/g, '<br>')}</div>
        <div class="post-actions">
          <button aria-label="Like"><span>❤️</span> 1</button>
          <button aria-label="Comment"><span>💬</span> 0</button>
          <button aria-label="Share"><span>🔄</span> 0</button>
        </div>
      `;
      container.prepend(post);
      closeModal(modalPost);
      postForm.reset();
      if (altTextInput) altTextInput.disabled = true;
    });
  }

  // ===== Sample Posts =====
  const samplePosts = [
    {
      name: "Jane M.",
      time: "10 mins ago",
      content: "Just aced my Chemistry quiz on acids & bases! Tip: Use the pH scale song 🎵",
      likes: 12,
      comments: 3
    },
    {
      name: "David K.",
      time: "1 hour ago",
      content: "Struggling with HTML forms? I made a cheat sheet — DM me!",
      likes: 8,
      comments: 5
    }
  ];

  const feedPosts = document.getElementById('feed-posts');
  if (feedPosts) {
    samplePosts.forEach(post => {
      const el = document.createElement('article');
      el.className = 'post';
      el.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">👤</div>
          <div class="post-meta">
            <strong>${post.name}</strong> • <time>${post.time}</time>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <button aria-label="Like"><span>❤️</span> ${post.likes}</button>
          <button aria-label="Comment"><span>💬</span> ${post.comments}</button>
          <button aria-label="Share"><span>🔄</span> 1</button>
        </div>
      `;
      feedPosts.appendChild(el);
    });
  }
  
  console.log('✅ Dashboard initialized');

  // ===== Mobile Navigation Sync =====
const mobileBookBtn = document.getElementById('mobile-book');
const mobilePostBtn = document.getElementById('mobile-post');
const mobileFeedsBtn = document.getElementById('mobile-feeds');

// Sync mobile buttons with desktop actions
if (mobileBookBtn && bookBtn) {
  mobileBookBtn.addEventListener('click', () => bookBtn.click());
}
if (mobilePostBtn && postBtn) {
  mobilePostBtn.addEventListener('click', () => postBtn.click());
}
if (mobileFeedsBtn && toggleFeedBtn) {
  mobileFeedsBtn.addEventListener('click', () => {
    toggleFeedBtn.click();
    // Toggle active state
    document.querySelectorAll('.nav-btn').forEach(btn => 
      btn.classList.toggle('active', btn === mobileFeedsBtn)
    );
  });
}

// Update feed button state when toggled
if (toggleFeedBtn && feedContainer) {
  toggleFeedBtn.addEventListener('click', () => {
    if (mobileFeedsBtn) {
      mobileFeedsBtn.classList.toggle('active', !feedContainer.hidden);
    }
  });
}
});