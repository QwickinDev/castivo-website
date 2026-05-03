/* =====================================================================
   CASTIVO — Shared JS
   ===================================================================== */
(function () {
  'use strict';

  // ===== Mobile menu =====
  const navToggle = document.querySelector('.nav-mobile-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navMobile.classList.toggle('is-open');
      document.body.style.overflow = navMobile.classList.contains('is-open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Carousel =====
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const cards = track ? track.children : [];
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (!track || !cards.length) return;
    let index = 0;
    function visibleCount() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 920) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, cards.length - visibleCount()); }
    function update() {
      const totalSteps = maxIndex() + 1;
      if (index > maxIndex()) index = maxIndex();
      const cardWidth = cards[0].getBoundingClientRect().width + 18;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSteps; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === index ? ' is-active' : '');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => { index = i; update(); });
          dotsContainer.appendChild(dot);
        }
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { if (index > 0) { index--; update(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (index < maxIndex()) { index++; update(); } });
    let startX = 0, isDragging = false;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      if (dx > 0 && index > 0) index--;
      else if (dx < 0 && index < maxIndex()) index++;
      update();
    });
    window.addEventListener('resize', update);
    update();
  });

  // ===== Pricing toggle =====
  const pricingToggle = document.querySelector('.pricing-toggle');
  if (pricingToggle) {
    const buttons = pricingToggle.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const mode = btn.dataset.billing;
        document.querySelectorAll('[data-price-monthly]').forEach(el => {
          el.style.display = mode === 'monthly' ? '' : 'none';
        });
        document.querySelectorAll('[data-price-annual]').forEach(el => {
          el.style.display = mode === 'annual' ? '' : 'none';
        });
      });
    });
  }

  // ===== Login form (demo only) =====
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Signing in…';
        btn.disabled = true;
        setTimeout(() => {
          alert('Demo login form. In production this would authenticate against the Castivo cloud platform and redirect to the customer portal.');
          btn.textContent = original;
          btn.disabled = false;
        }, 800);
      }
    });
  }

  // ===== Demo video modal =====
  const videoFrame = document.querySelector('.video-frame');
  const videoModal = document.querySelector('.video-modal');
  if (videoFrame && videoModal) {
    videoFrame.addEventListener('click', () => {
      videoModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal || e.target.closest('.video-modal-close')) {
        videoModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== Booking widget =====
  initBookingWidgets();
  function initBookingWidgets() {
    document.querySelectorAll('.booking-widget').forEach(setupBooking);
  }

  function setupBooking(widget) {
    const cal = widget.querySelector('.cal');
    if (!cal) return;
    const monthLabel = cal.querySelector('.cal-month');
    const grid = cal.querySelector('.cal-grid');
    const prev = cal.querySelector('.cal-prev');
    const next = cal.querySelector('.cal-next');
    const slotsContainer = widget.querySelector('.time-slots');
    const step1 = widget.querySelector('.booking-step-1');
    const step2 = widget.querySelector('.booking-step-2');
    const continueBtn = widget.querySelector('[data-booking-continue]');
    const backBtn = widget.querySelector('[data-booking-back]');
    const form = widget.querySelector('.booking-form');
    const dateDisplay = widget.querySelector('[data-selected-date]');
    const timeDisplay = widget.querySelector('[data-selected-time]');

    let viewDate = new Date();
    viewDate.setDate(1);
    let selectedDate = null;
    let selectedTime = null;

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['S','M','T','W','T','F','S'];

    function renderCalendar() {
      grid.innerHTML = '';
      monthLabel.textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      // Day-of-week headers
      dayNames.forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-dow';
        el.textContent = d;
        grid.appendChild(el);
      });
      // Empty slots before first day
      const firstDow = viewDate.getDay();
      const lastDayPrevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
      for (let i = firstDow - 1; i >= 0; i--) {
        const el = document.createElement('button');
        el.className = 'cal-day is-other';
        el.textContent = lastDayPrevMonth - i;
        el.disabled = true;
        grid.appendChild(el);
      }
      // Days of month
      const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
        const el = document.createElement('button');
        el.className = 'cal-day';
        el.textContent = d;
        const isPast = dateObj < today;
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
        if (isPast || isWeekend) {
          el.classList.add('is-disabled');
          el.disabled = true;
        }
        if (dateObj.getTime() === today.getTime()) el.classList.add('is-today');
        if (selectedDate && dateObj.getTime() === selectedDate.getTime()) el.classList.add('is-selected');
        el.addEventListener('click', () => {
          if (el.disabled) return;
          selectedDate = dateObj;
          selectedTime = null;
          renderCalendar();
          renderSlots();
          updateContinueState();
        });
        grid.appendChild(el);
      }
    }

    function renderSlots() {
      if (!slotsContainer) return;
      const times = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
      slotsContainer.innerHTML = '';
      if (!selectedDate) {
        slotsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--stone); font-size: 13px; padding: 20px 0;">Pick a date to see available times</div>';
        return;
      }
      times.forEach(t => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'time-slot' + (selectedTime === t ? ' is-selected' : '');
        el.textContent = t;
        el.addEventListener('click', () => {
          selectedTime = t;
          renderSlots();
          updateContinueState();
        });
        slotsContainer.appendChild(el);
      });
    }

    function updateContinueState() {
      if (continueBtn) continueBtn.disabled = !(selectedDate && selectedTime);
    }

    if (prev) prev.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
    if (next) next.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });

    if (continueBtn) continueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!selectedDate || !selectedTime) return;
      step1.classList.add('is-hidden');
      step2.classList.add('is-active');
      if (dateDisplay) dateDisplay.textContent = selectedDate.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
      if (timeDisplay) timeDisplay.textContent = selectedTime;
    });
    if (backBtn) backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      step1.classList.remove('is-hidden');
      step2.classList.remove('is-active');
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          date: selectedDate.toLocaleDateString('en-AU'),
          time: selectedTime,
          name: form.querySelector('[name=name]')?.value,
          business: form.querySelector('[name=business]')?.value,
          email: form.querySelector('[name=email]')?.value
        };
        alert(`Demo booking received\n\nName: ${data.name}\nBusiness: ${data.business}\nDate: ${data.date}\nTime: ${data.time}\n\nIn production, this would create a calendar event and send a confirmation email.`);
        // Reset
        selectedDate = null;
        selectedTime = null;
        form.reset();
        step2.classList.remove('is-active');
        step1.classList.remove('is-hidden');
        renderCalendar();
        renderSlots();
        updateContinueState();
      });
    }

    renderCalendar();
    renderSlots();
    updateContinueState();
  }

  // ===== AI Assistant chat =====
  const aiBubble = document.querySelector('.ai-bubble');
  const aiPanel = document.querySelector('.ai-panel');
  if (aiBubble && aiPanel) {
    aiBubble.addEventListener('click', () => {
      aiBubble.classList.toggle('is-open');
      aiPanel.classList.toggle('is-open');
    });
    const messages = aiPanel.querySelector('.ai-messages');
    const input = aiPanel.querySelector('.ai-input input');
    const sendBtn = aiPanel.querySelector('.ai-input button');
    const chips = aiPanel.querySelectorAll('.ai-chip');

    const responses = {
      'how does pricing work': 'Castivo has 4 plans, all in AUD: <b>Free</b> ($0, 1 screen with watermark), <b>Starter</b> ($9/screen/month), <b>Pro</b> ($19/screen/month, our most popular), and <b>Business</b> ($29/screen/month). Annual billing saves about 17%. Want me to point you to the pricing page?',
      'what tvs are supported': 'Any modern Android TV running Android 8.0 or later with at least 2GB RAM. Recommended: Hisense, TCL, Sony Bravia, Chromecast with Google TV, or Nvidia Shield. Samsung (Tizen) and LG (webOS) aren\'t directly supported — use a Chromecast plugged into them instead.',
      'book a demo': 'You can book a 30-minute demo right from this site. Head to the Resources page and scroll to the booking section — you can pick a date and time that suits you. Want me to take you there?',
      'how do i set up': 'Three steps: (1) Sign up at castivo.com.au and pick a plan, (2) Install the Castivo app on your Android TV, (3) Enter the 6-digit passcode shown on your TV into the cloud portal. Total time: under 60 seconds. We can also do it for you in person if you\'re in metro Australia.',
      'is there a free trial': 'Better — there\'s a free <i>plan</i>. One Android TV, free forever, with a small Castivo watermark on the screen. No credit card needed. Upgrade anytime.',
      'do you sell the tv': 'No — Castivo is software-only. You bring your own Android TV. If you don\'t have one, a $79 Chromecast with Google TV plugged into any HDMI display works perfectly.',
      'cancel': 'After your initial term (month-to-month, 12, or 24 months — your choice), you can cancel anytime with 30 days\' notice. No 70% penalty, no exit fees.',
      'default': 'I can help with pricing, supported TVs, setup, booking a demo, or any general Castivo questions. What would you like to know?'
    };

    function findResponse(text) {
      const lower = text.toLowerCase();
      for (const key in responses) {
        if (key !== 'default' && lower.includes(key.replace(/\s+/g, ''))) return responses[key];
        if (key !== 'default' && lower.includes(key)) return responses[key];
      }
      // Keyword fallbacks
      if (lower.match(/\b(price|cost|how much|plan)\b/)) return responses['how does pricing work'];
      if (lower.match(/\b(tv|device|hardware|android)\b/)) return responses['what tvs are supported'];
      if (lower.match(/\b(demo|book|appointment)\b/)) return responses['book a demo'];
      if (lower.match(/\b(setup|install|pair|passcode)\b/)) return responses['how do i set up'];
      if (lower.match(/\b(trial|free|test)\b/)) return responses['is there a free trial'];
      if (lower.match(/\b(cancel|exit|leave|terminate)\b/)) return responses['cancel'];
      if (lower.match(/\b(hardware|player|screen|ship)\b/)) return responses['do you sell the tv'];
      return responses['default'];
    }

    function addMessage(text, from) {
      const el = document.createElement('div');
      el.className = `ai-msg from-${from}`;
      el.innerHTML = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'ai-typing';
      el.id = 'ai-typing-indicator';
      el.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }
    function hideTyping() {
      const el = document.getElementById('ai-typing-indicator');
      if (el) el.remove();
    }

    function sendMessage(text) {
      if (!text.trim()) return;
      addMessage(text, 'user');
      input.value = '';
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage(findResponse(text), 'bot');
      }, 800 + Math.random() * 600);
    }

    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(input.value));
    if (input) input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage(input.value);
    });
    chips.forEach(chip => {
      chip.addEventListener('click', () => sendMessage(chip.textContent));
    });
  }

  // ===== Signup multi-step =====
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    const steps = signupForm.querySelectorAll('.signup-step');
    const dots = signupForm.querySelectorAll('.step-indicator .step-dot');
    let currentStep = 0;

    function showStep(idx) {
      steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
        d.classList.toggle('is-complete', i < idx);
      });
      currentStep = idx;
    }

    signupForm.querySelectorAll('[data-signup-next]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = steps[currentStep];
        const required = step.querySelectorAll('input[required], select[required]');
        let valid = true;
        required.forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = 'var(--red)';
            valid = false;
          } else {
            field.style.borderColor = '';
          }
        });
        if (currentStep === 2) {
          const planSelected = signupForm.querySelector('.plan-pick.is-selected');
          if (!planSelected) {
            alert('Please select a plan to continue.');
            valid = false;
          }
        }
        if (valid && currentStep < steps.length - 1) showStep(currentStep + 1);
      });
    });
    signupForm.querySelectorAll('[data-signup-back]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStep > 0) showStep(currentStep - 1);
      });
    });

    // Plan picker
    signupForm.querySelectorAll('.plan-pick').forEach(card => {
      card.addEventListener('click', () => {
        signupForm.querySelectorAll('.plan-pick').forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      });
    });

    showStep(0);
  }

  // ===== Testimonials filter =====
  const filters = document.querySelectorAll('.filter-chip');
  const testiCards = document.querySelectorAll('.testi-card');
  if (filters.length && testiCards.length) {
    filters.forEach(f => {
      f.addEventListener('click', () => {
        const tag = f.dataset.filter;
        filters.forEach(x => x.classList.remove('is-active'));
        f.classList.add('is-active');
        testiCards.forEach(c => {
          if (tag === 'all' || c.dataset.industry === tag) c.classList.remove('testi-hidden');
          else c.classList.add('testi-hidden');
        });
      });
    });
  }

  // ===== Submit testimonial form =====
  const submitTestimonialForm = document.querySelector('.submit-testimonial-form');
  if (submitTestimonialForm) {
    submitTestimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for sharing your story! Our team will review and get in touch within 2 business days.');
      submitTestimonialForm.reset();
    });
  }

  // ───── Inline Cassie (homepage) ─────
  const cassieInline = document.querySelector('[data-cassie-inline]');
  if (cassieInline) {
    // Mark body so we can hide the floating bubble on desktop where the
    // inline version takes over hero duty.
    document.body.classList.add('has-cassie-inline');

    const input = cassieInline.querySelector('input');
    const sendBtn = cassieInline.querySelector('.cassie-send');
    const chips = cassieInline.querySelectorAll('.cassie-chip');
    const chatBody = cassieInline; // we'll append messages here as needed

    const stockReplies = {
      // Lightweight keyword router — enough to feel responsive without
      // a real backend. Wire to your own LLM endpoint to upgrade.
      pricing: "Castivo plans run from <b>free</b> (1 screen) to <b>$29/screen/month</b> (Business). For 5 screens on Pro you'd pay <b>$95/month</b> billed monthly, or <b>$78.75/month</b> annual. No setup fees. Want me to walk you through a tier?",
      tv: "Castivo runs on <b>any Android TV 8.0 or newer</b> — Hisense, TCL, Sony, Philips, Xiaomi, plus Nvidia Shield, Chromecast with Google TV, and Android TV boxes. Tell me your model and I'll confirm.",
      cancel: "Yep — <b>cancel anytime</b> after the initial term with 30 days' notice. No 70% penalty fees, no early-exit charges, no personal guarantee for established ABNs. Month-to-month is also an option.",
      mandoe: "Switching is straightforward: you sign up with us, install our app on the same TV, and pair it. We'll help you replicate your existing content for free during onboarding. Most customers are live on Castivo within an hour.",
      default: "Good question — let me get you to the right answer. Want me to email a detailed reply to you, or would you rather <a href='#book-demo' style='color:var(--tangerine);'>book a 30-min call</a> with the team?"
    };

    function appendMsg(text, fromBot = true) {
      const msg = document.createElement('div');
      msg.className = 'cassie-msg from-bot';
      msg.style.cssText = 'background:' + (fromBot ? 'var(--cream)' : 'var(--tangerine)') +
                          ';color:' + (fromBot ? 'inherit' : 'white') +
                          ';padding:14px 18px;border-radius:14px;font-size:14.5px;line-height:1.5;' +
                          'max-width:540px;margin:14px 0 0;' +
                          'border-bottom-left-radius:' + (fromBot ? '4px' : '14px') + ';' +
                          'border-bottom-right-radius:' + (fromBot ? '14px' : '4px') + ';' +
                          (fromBot ? '' : 'margin-left:auto;');
      msg.innerHTML = text;
      const inputRow = chatBody.querySelector('.cassie-input-row');
      chatBody.insertBefore(msg, inputRow);
      msg.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    function route(text) {
      const t = text.toLowerCase();
      if (/price|cost|how much|tier|plan/.test(t)) return stockReplies.pricing;
      if (/tv|hisense|tcl|sony|android|shield|chromecast/.test(t)) return stockReplies.tv;
      if (/cancel|exit|leave|lock|contract/.test(t)) return stockReplies.cancel;
      if (/switch|migrate|move from|change from/.test(t)) return stockReplies.mandoe;
      return stockReplies.default;
    }

    function send(text) {
      if (!text || !text.trim()) return;
      appendMsg(text.trim(), false);
      input.value = '';
      // Simulate a brief 'thinking' delay
      setTimeout(() => appendMsg(route(text)), 600);
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt || chip.textContent;
        send(prompt);
      });
    });

    sendBtn.addEventListener('click', () => send(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); send(input.value); }
    });
  }

})();
