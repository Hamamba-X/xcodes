// tutor-dashboard.js — Ndaiya Tutor Dashboard
// Fetches booked lessons & handles lesson acceptance

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : 'https://api.ndaiya.education';

  const lessonsFeed = document.getElementById('lessons-feed');
  const noLessons = document.getElementById('no-lessons');
  const modal = document.getElementById('lesson-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const modalAccept = document.getElementById('modal-accept');

  // Sample lessons (replace with API call)
  const lessons = [
    {
      id: 'L1001',
      learner: { name: 'Jane Smith', grade: 'Grade 10', avatarInitials: 'JS' },
      subject: 'Mathematics',
      topic: 'Quadratic Equations',
      focus: 'Solving by factorization & formula',
      dateTime: '2025-12-08T15:30:00+03:00', // EAT
      duration: 60,
      status: 'paid'
    },
    {
      id: 'L1002',
      learner: { name: 'Kwame O.', grade: 'Form 3', avatarInitials: 'KO' },
      subject: 'Physics',
      topic: 'Newton’s Laws',
      focus: 'Free-body diagrams & friction',
      dateTime: '2025-12-09T10:00:00+03:00',
      duration: 45,
      status: 'paid'
    }
  ];

  // 🎯 Render lessons
  function renderLessons() {
    if (lessons.length === 0) {
      noLessons.style.display = 'block';
      lessonsFeed.innerHTML = '';
      return;
    }

    lessonsFeed.innerHTML = lessons.map(lesson => {
      const dt = new Date(lesson.dateTime);
      const now = new Date();
      const diffMins = Math.floor((dt - now) / 60000);
      const canAccept = diffMins <= 30 && diffMins >= 0;

      return `
        <div class="lesson-card">
          <div class="lesson-header">
            <div class="lesson-avatar">${lesson.learner.avatarInitials}</div>
            <div class="lesson-info">
              <div class="lesson-title">${lesson.subject} • ${lesson.topic}</div>
              <div class="lesson-meta">
                ${lesson.learner.name} • ${lesson.learner.grade}
              </div>
            </div>
            <div class="lesson-time">
              📅 ${dt.toLocaleDateString('en-ZM')}<br>
              ⏰ ${dt.toLocaleTimeString('en-ZM', { hour12: true, hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div class="lesson-body">
            <div class="lesson-details">
              <div><span class="label">Focus:</span> <span class="value">${lesson.focus}</span></div>
              <div><span class="label">Duration:</span> <span class="value">${lesson.duration} min</span></div>
            </div>
            <div class="lesson-actions">
              <button class="btn btn-view" data-id="${lesson.id}">View Details</button>
              ${canAccept ? 
                `<button class="btn btn-primary" onclick="acceptLesson('${lesson.id}')">Accept to Teach</button>` :
                `<button class="btn btn-outline" disabled>Starts in ${Math.max(0, diffMins)} min</button>`
              }
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind View Details buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => openLessonModal(btn.dataset.id));
    });
  }

  // 🔍 Open lesson modal
  function openLessonModal(id) {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;

    const dt = new Date(lesson.dateTime);
    
    // Update modal content
    document.getElementById('modal-title').textContent = `${lesson.subject} Lesson`;
    document.getElementById('modal-avatar').textContent = lesson.learner.avatarInitials;
    document.getElementById('modal-learner-name').textContent = lesson.learner.name;
    document.getElementById('modal-grade').textContent = lesson.learner.grade;
    document.getElementById('modal-subject').textContent = lesson.subject;
    document.getElementById('modal-topic').textContent = lesson.topic;
    document.getElementById('modal-focus').textContent = lesson.focus;
    document.getElementById('modal-datetime').textContent = 
      `${dt.toLocaleDateString('en-ZM', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • ${dt.toLocaleTimeString('en-ZM', { hour12: true, hour: '2-digit', minute: '2-digit' })} EAT`;
    document.getElementById('modal-duration').textContent = `${lesson.duration} minutes`;

    // Handle Accept button state
    const now = new Date();
    const diffMins = Math.floor((dt - now) / 60000);
    const canAccept = diffMins <= 30 && diffMins >= 0;

    modalAccept.disabled = !canAccept;
    if (canAccept) {
      modalAccept.textContent = 'Accept to Teach';
    } else {
      modalAccept.textContent = `Available in ${Math.max(0, 30 - diffMins)} min`;
    }

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  // ✅ Accept lesson
  window.acceptLesson = async (id) => {
    try {
      // In real app: POST to /api/lessons/L1001/accept
      console.log('Accepting lesson:', id);
      alert(`✅ Lesson accepted! Join room at start time.`);
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    } catch (error) {
      alert('❌ Failed to accept lesson. Please try again.');
    }
  };

  // 🚪 Modal close handlers
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });
  modalCancel.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // 🔌 Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('ndaiya_token');
    window.location.href = '/index.html';
  });

  // 🚀 Initialize
  renderLessons();
  console.log('✅ Tutor dashboard loaded. Using API:', API_BASE);

  // 🔐 dotenvx Ops reminder
  if (window.location.hostname === 'localhost') {
    console.log(
      `%c💡 Pro Tip: Run backend with \`npx dotenvx run -- node server.js\` for SOC 2–ready secret management.`,
      'color: #3b82f6; font-weight: bold;'
    );
  }
});