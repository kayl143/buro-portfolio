/**
 * Jay Wilfred Buro — Portfolio Scripts
 * Handles interactions, carousel navigation, photo upload preview, theme toggle, and project modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ================= 1. THEME SWITCHER (DARK / LIGHT) =================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('buro-theme') || 'light';
  
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('buro-theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
    }
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'light';
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // ================= 2. TYPEWRITER EFFECT =================
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'digital developer',
    'BSIT student',
    'UI/UX creator',
    'tech enthusiast',
    'system designer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typewriterElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at complete word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  setTimeout(typeEffect, 800);

  // ================= 3. PHOTO UPLOAD & INSTANT PREVIEW =================
  const avatarContainer = document.getElementById('avatar-container');
  const photoInput = document.getElementById('photo-upload-input');
  const userAvatar = document.getElementById('user-avatar');
  const triggerUploadBtn = document.getElementById('trigger-upload-btn');

  // Check if user previously saved a custom photo in localStorage
  const savedAvatar = localStorage.getItem('buro-custom-avatar');
  if (savedAvatar && userAvatar) {
    userAvatar.src = savedAvatar;
  }

  function promptPhotoSelection() {
    if (photoInput) photoInput.click();
  }

  if (avatarContainer) {
    avatarContainer.addEventListener('click', promptPhotoSelection);
  }

  if (triggerUploadBtn) {
    triggerUploadBtn.addEventListener('click', promptPhotoSelection);
  }

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          userAvatar.src = result;
          try {
            localStorage.setItem('buro-custom-avatar', result);
          } catch (err) {
            // In case of quota exceed with large images
            console.warn('Could not cache large image to localStorage:', err);
          }
          showToast('Profile photo updated successfully!');
        };
        reader.readAsDataURL(file);
      }
    });

    // Drag and Drop support onto avatar
    if (avatarContainer) {
      ['dragenter', 'dragover'].forEach(eventName => {
        avatarContainer.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          avatarContainer.style.transform = 'scale(1.06)';
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        avatarContainer.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          avatarContainer.style.transform = '';
        });
      });

      avatarContainer.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files && dt.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            userAvatar.src = event.target.result;
            showToast('Profile photo updated successfully!');
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // ================= 4. EXPERTISE SLIDER ARROWS =================
  const trackWrapper = document.querySelector('.expertise-track-wrapper');
  const prevBtn = document.getElementById('expertise-prev');
  const nextBtn = document.getElementById('expertise-next');

  if (trackWrapper && prevBtn && nextBtn) {
    const cardWidth = 320; // approximate scroll distance per card

    prevBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      prevBtn.classList.add('active');
      nextBtn.classList.remove('active');
    });

    nextBtn.addEventListener('click', () => {
      trackWrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
      nextBtn.classList.add('active');
      prevBtn.classList.remove('active');
    });

    trackWrapper.addEventListener('scroll', () => {
      if (trackWrapper.scrollLeft <= 10) {
        prevBtn.classList.remove('active');
        nextBtn.classList.add('active');
      } else if (trackWrapper.scrollLeft + trackWrapper.clientWidth >= trackWrapper.scrollWidth - 10) {
        nextBtn.classList.remove('active');
        prevBtn.classList.add('active');
      }
    });
  }

  // ================= 5. PORTFOLIO FILTER TABS =================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 6. PROJECT MODAL DETAILS =================
  const projectData = {
    portal: {
      title: 'College Student Information & Grading Portal',
      category: 'Academic Project • Torres Capitol College',
      description: 'An enterprise-grade academic portal prototype tailored for Torres Capitol College students and faculty. Features role-based dashboards, course enrollment tracking, continuous grade computations, and announcement feeds.',
      tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
      features: [
        'Secure student & faculty authentication with password hashing',
        'Real-time grade computation and GPA calculation modules',
        'Transcript preview and PDF export capabilities',
        'Role-permission hierarchy (Dean, Instructor, Student)'
      ]
    },
    inventory: {
      title: 'Smart Campus Asset & Inventory Tracker',
      category: 'Campus IT Infrastructure Project',
      description: 'Designed specifically to streamline IT inventory workflows across campus computer laboratories. Tracks equipment status, repair history, warranty terms, and active component checkouts.',
      tech: ['JavaScript ES6+', 'Local Database / SQL', 'Chart.js Visuals', 'CSS Grid'],
      features: [
        'Interactive dashboard displaying active vs. in-repair hardware',
        'Quick barcode/asset ID lookup engine',
        'Automatic log of maintenance requests and lab technician sign-offs',
        'Exportable monthly audit reports'
      ]
    },
    community: {
      title: 'Torres Capitol Community Hub App Prototype',
      category: 'UI/UX Design System & Mobile Prototype',
      description: 'A contemporary campus mobile experience designed in Figma to connect students, academic clubs, and campus organizations with a unified calendar and social feed.',
      tech: ['Figma', 'UI Prototyping', 'User Research', 'Design System Architecture'],
      features: [
        'High-fidelity interactive prototype with micro-animations',
        'Accessible color palettes complying with WCAG standards',
        'Campus event discovery feed with RSVP integration',
        'Comprehensive component design tokens'
      ]
    },
    portfolio: {
      title: 'Jay Wilfred Buro — Digital Brandfolio',
      category: 'Personal Portfolio Architecture',
      description: 'A high-impact, custom-crafted digital portfolio inspired by sleek Webflow agency standards. Incorporates concentric layered purple rings, dynamic theme persistence, instant browser image uploads, and clean typography.',
      tech: ['Semantic HTML5', 'Custom CSS Architecture', 'Vanilla JS', 'SVG Aesthetics'],
      features: [
        'Double-ring concentric hero showcase matching Webflow aesthetics',
        'Instant client-side photo loader with drag-and-drop support',
        'Seamless dark/light mode toggle with stored preference',
        '100% responsive and accessible mobile drawer architecture'
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal');
  const demoButtons = document.querySelectorAll('.open-demo-btn');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalContent.innerHTML = `
        <span class="project-category" style="display:block; margin-bottom: 0.5rem;">${data.category}</span>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main);">${data.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.98rem; line-height: 1.65; margin-bottom: 1.5rem;">${data.description}</p>
        
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-main);">Key Features & Architecture:</h4>
        <ul style="list-style: none; margin-bottom: 1.75rem;">
          ${data.features.map(f => `
            <li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
              <i class="fa-solid fa-check" style="color: var(--primary);"></i> ${f}
            </li>
          `).join('')}
        </ul>

        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 2rem;">
          ${data.tech.map(t => `
            <span style="font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 9999px; background: var(--bg-secondary); color: var(--primary); border: 1px solid var(--border-color);">${t}</span>
          `).join('')}
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <a href="#contact" class="btn btn-pill-primary modal-contact-link" style="padding: 0.75rem 1.75rem; font-size: 0.92rem;">Inquire About Project</a>
          <button class="btn btn-pill-secondary modal-close-action" style="padding: 0.75rem 1.5rem; font-size: 0.92rem;">Close</button>
        </div>
      `;

      projectModal.classList.add('open');

      const modalCloseAction = modalContent.querySelector('.modal-close-action');
      if (modalCloseAction) {
        modalCloseAction.addEventListener('click', () => projectModal.classList.remove('open'));
      }
      const modalContactLink = modalContent.querySelector('.modal-contact-link');
      if (modalContactLink) {
        modalContactLink.addEventListener('click', () => projectModal.classList.remove('open'));
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => projectModal.classList.remove('open'));
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
      }
    });
  }

  // ================= 6B. CERTIFICATE PREVIEW MODAL =================
  const certModal = document.getElementById('cert-modal');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalMeta = document.getElementById('cert-modal-meta');
  const certModalId = document.getElementById('cert-modal-id');
  const certModalDownload = document.getElementById('cert-modal-download');
  const closeCertModalBtn = document.getElementById('close-cert-modal');
  const certTriggers = document.querySelectorAll('.view-cert-trigger');

  function openCertificateModal(imgSrc, title, meta, credId) {
    if (!certModal || !certModalImg) return;
    certModalImg.src = imgSrc;
    if (certModalTitle) certModalTitle.innerHTML = title;
    if (certModalMeta) certModalMeta.innerHTML = meta;
    if (certModalId) certModalId.textContent = credId ? `Ref / ID: ${credId}` : '';
    if (certModalDownload) {
      certModalDownload.href = imgSrc;
      certModalDownload.download = imgSrc.split('/').pop();
    }
    certModal.classList.add('open');
  }

  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = trigger.getAttribute('data-cert-img');
      const title = trigger.getAttribute('data-cert-title');
      const meta = trigger.getAttribute('data-cert-meta');
      const credId = trigger.getAttribute('data-cert-id');
      openCertificateModal(imgSrc, title, meta, credId);
    });
  });

  if (closeCertModalBtn) {
    closeCertModalBtn.addEventListener('click', () => {
      if (certModal) certModal.classList.remove('open');
    });
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('open');
      }
    });
  }

  // Global escape key handler to close any active modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal) projectModal.classList.remove('open');
      if (certModal) certModal.classList.remove('open');
    }
  });

  // ================= 7. COPY EMAIL BUTTON =================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'jaywilfredburo@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard: ' + email);
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }

  // ================= 8. CONTACT FORM SUBMISSION =================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      // Simulate sending delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
        contactForm.reset();
        showToast('Thank you! Your message has been sent to Jay Wilfred.');

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1200);
    });
  }

  // ================= 9. MOBILE NAVIGATION DRAWER =================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ================= 10. BACK TO TOP BUTTON =================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================= 11. ACTIVE NAV HIGHLIGHT ON SCROLL =================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ================= 12. TOAST POPUP HELPER =================
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
});

