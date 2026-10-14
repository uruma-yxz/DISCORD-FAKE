/**
 * DISCORD LOGIN - INTERATIVIDADE & LÓGICA DO CLIENTE
 * Funcionalidades: Validação fiel, simulação de scan de QR, sintetizador de som Web Audio,
 * alternância para formulário de cadastro, e feedback visual estilo Discord.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS DO DOM ---
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const successView = document.getElementById('success-view');

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const loginEmail = document.getElementById('login-email');
  const loginPass = document.getElementById('login-password');
  const emailGroup = document.getElementById('email-group');
  const passwordGroup = document.getElementById('password-group');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  const loginSubmitBtn = document.getElementById('login-submit-btn');
  const registerSubmitBtn = document.getElementById('register-submit-btn');
  const logoutBtn = document.getElementById('logout-btn');

  const switchToRegisterBtn = document.getElementById('switch-to-register-btn');
  const switchToLoginBtn = document.getElementById('switch-to-login-btn');
  const forgotPasswordBtn = document.getElementById('forgot-password-btn');
  const securityKeyBtn = document.getElementById('security-key-btn');
  const qrTrigger = document.getElementById('qr-trigger');

  const toggleLoginPass = document.getElementById('toggle-login-pass');
  const toggleRegPass = document.getElementById('toggle-reg-pass');
  const regPassword = document.getElementById('reg-password');

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundOnIcon = soundToggleBtn.querySelector('.sound-on-icon');
  const soundOffIcon = soundToggleBtn.querySelector('.sound-off-icon');

  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayTag = document.getElementById('user-display-tag');

  // --- CONTROLE DE ÁUDIO VIA WEB AUDIO API (Sintetizador de Efeitos Discord) ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Toca o tom icônico de notificação/login do Discord
  function playDiscordChime(type = 'success') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      if (type === 'success') {
        // Acorde característico e amigável (Dó - Sol - Si)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.08);

          gain.gain.setValueAtTime(0.001, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.45);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.5);
        });
      } else if (type === 'error') {
        // Tom de alerta suave
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'click') {
        // Click sutil
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {
      console.warn('Áudio não suportado ou bloqueado pelo navegador', e);
    }
  }

  // Alternar som ligado/desligado
  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundOnIcon.classList.remove('hidden');
      soundOffIcon.classList.add('hidden');
      showToast('Efeitos sonoros ativados', 'success');
      playDiscordChime('click');
    } else {
      soundOnIcon.classList.add('hidden');
      soundOffIcon.classList.remove('hidden');
      showToast('Efeitos sonoros desativados');
    }
  });

  // --- POPULAR DATAS NO FORMULÁRIO DE CADASTRO ---
  function populateDobSelects() {
    const daySelect = document.getElementById('dob-day');
    const yearSelect = document.getElementById('dob-year');

    if (daySelect && daySelect.options.length <= 1) {
      for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        daySelect.appendChild(opt);
      }
    }

    if (yearSelect && yearSelect.options.length <= 1) {
      const currentYear = new Date().getFullYear();
      for (let y = currentYear - 13; y >= 1940; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
      }
    }
  }
  populateDobSelects();

  // --- MOSTRAR / OCULTAR SENHA ---
  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      initAudio();
      playDiscordChime('click');
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';

      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');

      if (isPass) {
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    });
  }
  setupPasswordToggle(toggleLoginPass, loginPass);
  setupPasswordToggle(toggleRegPass, regPassword);

  // --- SISTEMA DE TOAST NOTIFICATIONS ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // --- VALIDAÇÃO DO LOGIN ---
  function clearLoginErrors() {
    emailGroup.classList.remove('has-error');
    passwordGroup.classList.remove('has-error');
    emailError.textContent = '';
    passwordError.textContent = '';
  }

  loginEmail.addEventListener('input', () => {
    if (loginEmail.value.trim() !== '') {
      emailGroup.classList.remove('has-error');
      emailError.textContent = '';
    }
  });

  loginPass.addEventListener('input', () => {
    if (loginPass.value.trim() !== '') {
      passwordGroup.classList.remove('has-error');
      passwordError.textContent = '';
    }
  });

  // --- SUBMISSÃO DO LOGIN ---
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    initAudio();
    clearLoginErrors();

    const emailValue = loginEmail.value.trim();
    const passValue = loginPass.value.trim();

    let hasError = false;

    if (!emailValue) {
      emailGroup.classList.add('has-error');
      emailError.textContent = '- Este campo é obrigatório';
      hasError = true;
    }

    if (!passValue) {
      passwordGroup.classList.add('has-error');
      passwordError.textContent = '- Este campo é obrigatório';
      hasError = true;
    }

    if (hasError) {
      playDiscordChime('error');
      return;
    }

    // Iniciar animação de carregamento (bouncing dots do Discord)
    setButtonLoading(loginSubmitBtn, true);

    setTimeout(() => {
      setButtonLoading(loginSubmitBtn, false);
      
      // Nome formatado para exibição
      const username = emailValue.split('@')[0] || 'DiscordUser';
      const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
      
      showSuccessView(formattedName, `${username.toLowerCase()}#0001`);
    }, 1200);
  });

  // --- SIMULAÇÃO DE LEITURA DO CÓDIGO QR ---
  qrTrigger.addEventListener('click', () => {
    initAudio();
    showToast('Escaneando código com Discord Mobile...', 'info');

    qrTrigger.style.transform = 'scale(0.96)';
    setTimeout(() => {
      qrTrigger.style.transform = '';
    }, 200);

    setTimeout(() => {
      showToast('Dispositivo verificado! Autorizando acesso...', 'success');
      showSuccessView('MobileGamer', 'gamer#1337');
    }, 1500);
  });

  // --- ALTERNÂNCIA ENTRE LOGIN E CADASTRO ---
  switchToRegisterBtn.addEventListener('click', () => {
    initAudio();
    playDiscordChime('click');
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  switchToLoginBtn.addEventListener('click', () => {
    initAudio();
    playDiscordChime('click');
    registerView.classList.add('hidden');
    loginView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- CADASTRO SIMULADO ---
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    initAudio();

    const regEmailVal = document.getElementById('reg-email').value.trim();
    const regUserVal = document.getElementById('reg-username').value.trim();
    const regPassVal = document.getElementById('reg-password').value.trim();

    if (!regEmailVal || !regUserVal || !regPassVal) {
      playDiscordChime('error');
      showToast('Por favor, preencha todos os campos obrigatórios (*)', 'error');
      return;
    }

    setButtonLoading(registerSubmitBtn, true);

    setTimeout(() => {
      setButtonLoading(registerSubmitBtn, false);
      const display = document.getElementById('reg-display').value.trim() || regUserVal;
      showSuccessView(display, `${regUserVal.toLowerCase()}#0420`);
    }, 1400);
  });

  // --- BOTÕES ADICIONAIS ---
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    initAudio();
    playDiscordChime('click');
    const email = loginEmail.value.trim();
    if (email) {
      showToast(`Instruções de redefinição enviadas para ${email}`, 'success');
    } else {
      showToast('Insira seu e-mail no campo acima para receber as instruções.', 'error');
      loginEmail.focus();
    }
  });

  securityKeyBtn.addEventListener('click', () => {
    initAudio();
    playDiscordChime('click');
    showToast('Aguardando aprovação da passkey (WebAuthn / FIDO2)...', 'info');
  });

  // --- ESTADO DE SUCESSO E LOGOUT ---
  function showSuccessView(name, tag) {
    playDiscordChime('success');
    userDisplayName.textContent = `Olá, ${name}!`;
    userDisplayTag.textContent = `@${tag}`;

    loginView.classList.add('hidden');
    registerView.classList.add('hidden');
    successView.classList.remove('hidden');

    showToast('Login realizado com sucesso no Discord!', 'success');
  }

  logoutBtn.addEventListener('click', () => {
    initAudio();
    playDiscordChime('click');
    loginForm.reset();
    registerForm.reset();
    clearLoginErrors();

    successView.classList.add('hidden');
    registerView.classList.add('hidden');
    loginView.classList.remove('hidden');

    showToast('Você desconectou da sua conta.', 'info');
  });

  // --- HELPER: BOTÃO DE CARREGAMENTO ---
  function setButtonLoading(button, isLoading) {
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.btn-spinner');

    if (isLoading) {
      button.disabled = true;
      if (textSpan) textSpan.classList.add('hidden');
      if (spinner) spinner.classList.remove('hidden');
    } else {
      button.disabled = false;
      if (textSpan) textSpan.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
    }
  }
});
