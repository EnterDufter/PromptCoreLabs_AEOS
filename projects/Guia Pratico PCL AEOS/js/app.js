/* ==========================================================================
   PCL AEOS Guia Prático — Interatividade & Lógica de UI (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initTabs();
  initPowerShellHub();
  initScrollSpy();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. Cópia Rápida de Comandos e Snippets
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.btn-copy, .btn-copy-ps');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      let textToCopy = '';

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) textToCopy = el.innerText.trim();
      } else {
        // Pega o código contido no bloco pai mais próximo
        const parentBox = btn.closest('.code-box') || btn.closest('.ps-content-body') || btn.closest('.command-container');
        if (parentBox) {
          const codeEl = parentBox.querySelector('pre, code, .copy-source');
          if (codeEl) textToCopy = codeEl.innerText.trim();
        }
      }

      if (!textToCopy && btn.getAttribute('data-code')) {
        textToCopy = btn.getAttribute('data-code');
      }

      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copiado!</span>';
          btn.style.borderColor = 'var(--accent-emerald)';
          btn.style.color = 'var(--accent-emerald)';

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Erro ao copiar para clipboard:', err);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Sistema de Abas Genérico (Tabs)
   -------------------------------------------------------------------------- */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs-wrapper');

  tabContainers.forEach(wrapper => {
    const tabButtons = wrapper.querySelectorAll('.tab-btn');
    const tabPanes = wrapper.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPaneId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = wrapper.querySelector(`#${targetPaneId}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Terminal Hub PowerShell — Alternância de Rotinas
   -------------------------------------------------------------------------- */
function initPowerShellHub() {
  const psTabs = document.querySelectorAll('.ps-tab-btn');
  const psPanes = document.querySelectorAll('.ps-routine-pane');

  psTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const routine = btn.getAttribute('data-routine');

      psTabs.forEach(b => b.classList.remove('active'));
      psPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(`ps-pane-${routine}`);
      if (target) {
        target.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. ScrollSpy & Navbar Navigation
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navPills = document.querySelectorAll('.nav-pill');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navPills.forEach(pill => {
      pill.classList.remove('active');
      if (pill.getAttribute('href') === `#${currentId}`) {
        pill.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Lightbox Modal para Visualização de Diagramas
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('diagram-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');

  if (!modal) return;

  const zoomableImgs = document.querySelectorAll('.zoomable-diagram');

  zoomableImgs.forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalTitle.innerText = img.getAttribute('alt') || 'Diagrama de Arquitetura PCL AEOS';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
