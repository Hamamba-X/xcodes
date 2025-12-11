// ===== DOM Elements =====
const bookBtn = document.getElementById('btn-book-lesson');
const postBtn = document.getElementById('btn-post-feed');
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

// ===== Topic Mapping =====
const topicsBySubject = {
  maths: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  english: ['Grammar', 'Essay Writing', 'Comprehension', 'Literature', 'Vocabulary'],
  physics: ['Mechanics', 'Waves', 'Electricity', 'Magnetism', 'Thermodynamics'],
  ict: ['HTML/CSS', 'Python Basics', 'Spreadsheets', 'Digital Safety', 'AI Intro'],
  agri: ['Crop Production', 'Soil Science', 'Animal Husbandry', 'Sustainable Farming']
};

// ===== Modal Handlers =====
function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = ''; 
}

bookBtn.addEventListener('click', () => openModal(modalBook));
postBtn.addEventListener('click', () => openModal(modalPost));

[closeModalBtn, cancelBookingBtn].forEach(btn => 
  btn.addEventListener('click', () => closeModal(modalBook))
);

[closePostModalBtn, cancelPostBtn].forEach(btn => 
  btn.addEventListener('click', () => closeModal(modalPost))
);

// Close modals on overlay click
modalBook.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modalBook));
modalPost.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modalPost));

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalBook.hidden) closeModal(modalBook);
    if (!modalPost.hidden) closeModal(modalPost);
  }
});

// ===== Subject -> Topic Logic =====
subjectSelect.addEventListener('change', function() {
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

// ===== Image Upload Accessibility =====
postImageInput.addEventListener('change', function() {
  altTextInput.disabled = !this.files.length;
  if (this.files.length) {
    altTextInput.focus(); // guide screen readers
  }
});

// ===== User Dropdown Toggle =====
userMenuBtn.addEventListener('click', function() {
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', !isExpanded);
  userDropdown.hidden = isExpanded;
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
    userMenuBtn.setAttribute('aria-expanded', 'false');
    userDropdown.hidden = true;
  }
});

// ===== Form Submissions =====
bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // In real app: send to API
  alert('✅ Lesson booked successfully!');
  closeModal(modalBook);
  bookingForm.reset();
  topicSelect.disabled = true;
});

postForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const text = document.getElementById('post-text').value.trim();
  if (!text) return;

  // Simulate post
  const postsContainer = document.getElementById('feed-posts');
  const now = new Date();
  const timeAgo = 'Just now';

  const postEl = document.createElement('article');
  postEl.className = 'post';
  postEl.innerHTML = `
    <div class="post-header">
      <div class="post-avatar">👤</div>
      <div class="post-meta">
        <strong>You</strong> • <time datetime="${now.toISOString()}">${timeAgo}</time>
      </div>
    </div>
    <div class="post-content">${text.replace(/\n/g, '<br>')}</div>
    <div class="post-actions">
      <button aria-label="Like"><span>❤️</span> 1</button>
      <button aria-label="Comment"><span>💬</span> 0</button>
      <button aria-label="Share"><span>🔄</span> 0</button>
    </div>
  `;
  postsContainer.insertBefore(postEl, postsContainer.firstChild);

  closeModal(modalPost);
  postForm.reset();
  altTextInput.disabled = true;
});

// ===== Initial Sample Feed Posts =====
document.addEventListener('DOMContentLoaded', () => {
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

  const postsContainer = document.getElementById('feed-posts');
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
    postsContainer.appendChild(el);
  });
});