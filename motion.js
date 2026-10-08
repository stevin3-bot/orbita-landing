// Page motion: reading progress, active section, headings, media reveals, the live orchestrator
// console, the window spotlight, the merge you can try, counters, trial days and the ticket tilt.
// Every string shown in the console and the merge card is the app's own.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const EN = document.documentElement.lang === 'en'
  const L = EN ? {
    prompt: 'Add online races with private rooms, a lobby and a guide to play',
    decide: 'You decide whether it goes out',
    routing: 'Looking for the session that knows these files and comparing costs…',
    proposal: '⑂ Split proposal · 3 parts', sentIn: '⑂ Split into 3 parts', sentStatus: (n, fin) => `Split into 3 parts · ${n}/3 ${fin ? 'finished' : 'ready'}`,
    working: 'Working…', finished: '✓ Finished',
    year: 'USD / year', month: 'USD / month', earlyYear: '79 USD a year, for life.', earlyMonth: '8 USD a month, for life.',
    merge: 'Merge into my work', tryIt: 'try it', merged: '✓ Merged with no conflicts.', runTests: 'Run the tests (npm test)',
    running: 'Running npm test…', pass: '✓ Tests pass', again: '↻ again',
  } : {
    prompt: 'Añade carreras online con salas privadas, un lobby y una guía para jugar',
    decide: 'Tú decides si se envía',
    routing: 'Buscando qué sesión conoce estos archivos y comparando costes…',
    proposal: '⑂ Propuesta repartida · 3 partes', sentIn: '⑂ Repartido en 3 partes', sentStatus: (n, fin) => `Repartido en 3 partes · ${n}/3 ${fin ? 'terminadas' : 'listas'}`,
    working: 'Trabajando…', finished: '✓ Terminado',
    year: 'USD / año', month: 'USD / mes', earlyYear: '79 USD al año, para siempre.', earlyMonth: '8 USD al mes, para siempre.',
    merge: 'Unir a mi trabajo', tryIt: 'pruébalo', merged: '✓ Se unió sin conflictos.', runTests: 'Pasar los tests (npm test)',
    running: 'Ejecutando npm test…', pass: '✓ Los tests pasan', again: '↻ otra vez',
  }
  const finePointer = matchMedia('(pointer: fine)').matches
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const once = (el, fn, threshold = 0.25) => {
    if (!el) return
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { io.disconnect(); fn() }
    }, { threshold })
    io.observe(el)
  }

  // ---------- reading progress + active section ----------
  const nav = $('nav')
  const onScroll = () => {
    const h = document.documentElement
    nav.style.setProperty('--read', (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4))
  }
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  const links = $$('nav ul a')
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]))
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    links.forEach((a) => a.classList.remove('on'))
    byId.get(e.target.id)?.classList.add('on')
  }), { rootMargin: '-45% 0px -50% 0px' })
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) secIO.observe(s) })

  // ---------- headings rise word by word ----------
  $$('section h2').forEach((h) => {
    let i = 0
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(part)
          const w = document.createElement('span')
          const inner = document.createElement('span')
          w.className = 'w'
          inner.textContent = part
          inner.style.setProperty('--i', i++)
          w.append(inner)
          frag.append(w)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1) walk(n)
    })
    walk(h)
    once(h, () => h.classList.add('seen'), 0.4)
  })

  // ---------- media reveal ----------
  $$('.reveal').forEach((el) => once(el, () => el.classList.add('seen'), 0.15))

  // ---------- counters ----------
  $$('.stat .n').forEach((el) => {
    const node = el.firstChild
    const target = parseInt(node.textContent, 10)
    if (!target || reduce) return
    node.textContent = '0'
    once(el, async () => {
      const t0 = performance.now(), dur = 700 + target * 60
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur)
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 0.6)
  })

  // ---------- trial days ----------
  const days = $('.days')
  if (days) {
    $$('span', days).forEach((d, i) => d.style.setProperty('--i', i))
    once(days, () => days.classList.add('seen'), 0.6)
  }

  // ---------- ticket tilt ----------
  const ticket = $('.ticket')
  if (ticket && finePointer && !reduce) {
    ticket.addEventListener('pointermove', (e) => {
      const r = ticket.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      ticket.classList.add('tilting')
      ticket.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`)
      ticket.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
    })
    ticket.addEventListener('pointerleave', () => {
      ticket.classList.remove('tilting')
      ticket.style.setProperty('--rx', '0deg')
      ticket.style.setProperty('--ry', '0deg')
    })
  }

  // ---------- collab screenshot drifts with the scroll ----------
  const shot = $('.stage .shot')
  if (shot && !reduce) {
    const drift = () => {
      const r = shot.getBoundingClientRect()
      const off = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
      shot.style.translate = `0 ${(off * -28).toFixed(1)}px`
    }
    addEventListener('scroll', drift, { passive: true })
    drift()
  }

  // ---------- window spotlight ----------
  const frame = $('#frame'), spot = $('#spot'), legend = $('#legend')
  if (frame && spot && legend) {
    // the four panes of shots/grid.png, in % of the image: left, top, right, bottom
    const PANES = [[14.6, 8.4, 56.9, 53.6], [57.3, 8.4, 99.7, 53.6], [14.6, 54.0, 56.9, 99.3], [57.3, 54.0, 99.7, 99.3]]
    const pins = $$('.pin', frame), items = $$('li', legend)
    let auto = null, touched = false, cur = -1
    const show = (i) => {
      cur = i
      const [l, t, r, b] = PANES[i]
      Object.assign(spot.style, { left: `${l}%`, top: `${t}%`, width: `${r - l}%`, height: `${b - t}%` })
      frame.classList.add('lit')
      pins.forEach((p, k) => p.classList.toggle('on', k === i))
      items.forEach((li, k) => li.classList.toggle('on', k === i))
    }
    const take = (i) => { touched = true; clearInterval(auto); show(i) }
    $$('button', legend).forEach((b) => {
      const i = +b.dataset.pane
      b.addEventListener('mouseenter', () => take(i))
      b.addEventListener('focus', () => take(i))
      b.addEventListener('click', () => take(i))
    })
    pins.forEach((p, i) => { p.style.pointerEvents = 'auto'; p.addEventListener('mouseenter', () => take(i)) })
    // anywhere over a pane lights that pane, not only its number
    frame.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100
      const i = PANES.findIndex(([l, t, rr, b]) => x >= l && x <= rr && y >= t && y <= b)
      if (i >= 0 && (i !== cur || !touched)) take(i)
    })
    new IntersectionObserver(([e]) => {
      if (touched) return
      clearInterval(auto)
      if (e.isIntersecting) {
        show(cur < 0 ? 0 : cur)
        if (!reduce) auto = setInterval(() => show((cur + 1) % PANES.length), 2800)
      }
    }, { threshold: 0.5 }).observe(frame)
  }

  // ---------- live orchestrator console ----------
  const cons = $('#console'), body = $('#consoleBody'), log = $('#log'), status = $('#consoleStatus'), send = $('#sendAll'), replay = $('#replay')
  if (cons && body && !reduce) {
    const PROMPT = L.prompt
    const parts = $$('.part', body).map((p) => p.outerHTML)
    const total = $('.total', body)?.outerHTML || ''
    let run = 0
    const step = (n) => $$('li', log).forEach((li) => li.classList.toggle('now', +li.dataset.step === n))
    const play = async () => {
      const id = ++run
      const alive = () => id === run
      replay.hidden = true
      log.classList.add('live')
      send.classList.remove('done', 'press')
      send.hidden = false
      status.textContent = L.decide
      body.innerHTML = ''
      step(0)
      const ask = document.createElement('div')
      ask.className = 'ask'
      ask.innerHTML = '<span></span><i class="caret"></i>'
      body.append(ask)
      for (let k = 1; k <= PROMPT.length; k++) {
        if (!alive()) return
        ask.firstChild.textContent = PROMPT.slice(0, k)
        await sleep(26)
      }
      ask.querySelector('.caret').remove()
      await sleep(350)
      if (!alive()) return
      const routing = document.createElement('div')
      routing.className = 'routing pop'
      routing.innerHTML = `<span class="spin"></span>${L.routing}`
      body.append(routing)
      await sleep(1300)
      if (!alive()) return
      routing.remove()
      step(1)
      const card = document.createElement('div')
      card.className = 'card-split pop'
      card.innerHTML = `<div class="cs-title mono">${L.proposal}</div>`
      body.append(card)
      for (const html of parts) {
        await sleep(260)
        if (!alive()) return
        card.insertAdjacentHTML('beforeend', html)
        card.lastElementChild.classList.add('pop')
      }
      await sleep(260)
      card.insertAdjacentHTML('beforeend', total)
      card.lastElementChild.classList.add('pop')
      await sleep(1500)
      if (!alive()) return
      send.classList.add('press')
      await sleep(180)
      send.classList.remove('press')
      send.classList.add('done')
      step(2)
      // the card becomes the app's "sent" view
      card.querySelector('.total')?.remove()
      card.querySelector('.cs-title').textContent = L.sentIn
      card.querySelector('.cs-title').insertAdjacentHTML('afterend', '<div class="bar2"><i></i></div>')
      const rows = $$('.part', card)
      rows.forEach((r) => r.insertAdjacentHTML('beforeend', `<span class="state"><span class="spin"></span>${L.working}</span>`))
      $$('.who', card).forEach((w) => w.remove())
      const bar = $('.bar2 i', card)
      status.textContent = L.sentStatus(0, false)
      const order = [2, 1, 0]
      for (let k = 0; k < order.length; k++) {
        await sleep(k === 0 ? 1500 : 900)
        if (!alive()) return
        const st = $('.state', rows[order[k]])
        st.className = 'state ok'
        st.textContent = L.finished
        bar.style.width = `${((k + 1) / 3) * 100}%`
        status.textContent = L.sentStatus(k + 1, k === 2)
      }
      step(-1)
      log.classList.remove('live')
      replay.hidden = false
    }
    replay.addEventListener('click', play)
    once(cons, play, 0.45)
  }

  // ---------- segmented controls: agent connection and autonomy level ----------
  const segPick = (seg, btn, out) => {
    $$('button', seg).forEach((b) => { b.classList.toggle('on', b === btn); b.setAttribute('aria-pressed', b === btn) })
    if (out && btn.dataset.desc) {
      out.innerHTML = btn.dataset.desc
      out.classList.remove('swap'); void out.offsetWidth; out.classList.add('swap')
    }
  }
  $$('.ab-row').forEach((row) => {
    const seg = $('.seg', row), out = $('.ab-desc', row)
    $$('button', seg).forEach((b) => b.addEventListener('click', () => segPick(seg, b, out)))
  })
  const autonomy = $('#autonomy'), autonomyDesc = $('#autonomyDesc')
  if (autonomy) $$('button', autonomy).forEach((b) => b.addEventListener('click', () => segPick(autonomy, b, autonomyDesc)))

  // ---------- themes: the preview recolors as a whole (palettes from the app's themes.json) ----------
  const THEMES = {"graphite": {"deep": "#0a0b0c", "darkest": "#0d0e10", "panel": "#111215", "side": "#0f1012", "card": "#16181b", "hover": "#1c1e22", "bd": "#222428", "a6": "#4763e8", "a4": "#7f98fb", "tx": "#e4e4e7", "mu": "#a1a1aa", "di": "#71717a", "label": "Grafito"}, "midnight": {"deep": "#0a0c12", "darkest": "#0f1117", "panel": "#12151d", "side": "#161922", "card": "#1c212d", "hover": "#222837", "bd": "#2a3142", "a6": "#4f46e5", "a4": "#818cf8", "tx": "#e2e8f0", "mu": "#94a3b8", "di": "#64748b", "label": "Medianoche"}, "ocean": {"deep": "#060d16", "darkest": "#0a1420", "panel": "#0e1a29", "side": "#112033", "card": "#16283e", "hover": "#1c314a", "bd": "#24405e", "a6": "#0284c7", "a4": "#38bdf8", "tx": "#e2e8f0", "mu": "#94a3b8", "di": "#64748b", "label": "Océano"}, "forest": {"deep": "#070f0c", "darkest": "#0b1511", "panel": "#0f1b16", "side": "#13211b", "card": "#182a22", "hover": "#1e332a", "bd": "#284536", "a6": "#059669", "a4": "#34d399", "tx": "#e2e8f0", "mu": "#94a3b8", "di": "#64748b", "label": "Bosque"}, "sunset": {"deep": "#110c09", "darkest": "#17110d", "panel": "#1d1611", "side": "#231a14", "card": "#2c2119", "hover": "#35281e", "bd": "#48372a", "a6": "#ea580c", "a4": "#fb923c", "tx": "#e7e5e4", "mu": "#a8a29e", "di": "#78716c", "label": "Atardecer"}, "dracula": {"deep": "#15131d", "darkest": "#1b1925", "panel": "#211e2d", "side": "#282a36", "card": "#2f3142", "hover": "#373a4d", "bd": "#44475a", "a6": "#c026d3", "a4": "#e879f9", "tx": "#e4e4e7", "mu": "#a1a1aa", "di": "#71717a", "label": "Drácula"}, "nord": {"deep": "#242933", "darkest": "#2a303b", "panel": "#2e3440", "side": "#333a47", "card": "#3b4252", "hover": "#434c5e", "bd": "#4c566a", "a6": "#0891b2", "a4": "#22d3ee", "tx": "#e2e8f0", "mu": "#94a3b8", "di": "#64748b", "label": "Nórdico"}, "carbon": {"deep": "#0a0a0a", "darkest": "#111111", "panel": "#161616", "side": "#1a1a1a", "card": "#212121", "hover": "#2a2a2a", "bd": "#333333", "a6": "#2563eb", "a4": "#60a5fa", "tx": "#e5e5e5", "mu": "#a3a3a3", "di": "#737373", "label": "Carbón"}, "light": {"deep": "#ececee", "darkest": "#f7f7f8", "panel": "#f1f1f3", "side": "#f4f4f5", "card": "#ffffff", "hover": "#f4f4f6", "bd": "#e2e2e6", "a6": "#4763e8", "a4": "#4763e8", "tx": "#18181b", "mu": "#52525b", "di": "#71717a", "label": "Claro"}}
  const sw = $('#swatches'), themeName = $('#themeName'), prev = $('#appPrev')
  if (sw && prev) $$('button', sw).forEach((b) => b.addEventListener('click', () => {
    const t = THEMES[b.dataset.theme]
    $$('button', sw).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b) })
    for (const [k, v] of Object.entries(t)) if (k !== 'label') prev.style.setProperty(`--${k}`, v)
    themeName.textContent = b.textContent.trim()
  }))

  // ---------- monthly / annual ----------
  const billing = $('#billing')
  if (billing) {
    const price = $('#price'), per = $('#per'), note = $('#annualNote'), early = $('#early')
    $$('button', billing).forEach((b) => b.addEventListener('click', () => {
      if (b.classList.contains('on')) return
      $$('button', billing).forEach((x) => x.classList.toggle('on', x === b))
      const year = b.dataset.plan === 'year'
      price.textContent = year ? '99' : '10'
      per.textContent = year ? L.year : L.month
      note.hidden = !year
      $('#earlyPrice').textContent = year ? L.earlyYear : L.earlyMonth
      price.classList.remove('flip'); void price.offsetWidth; price.classList.add('flip')
    }))
  }

  // ---------- a teammate's turn arrives in the activity feed ----------
  const live = $('#feed [data-live]')
  if (live && !reduce) {
    live.hidden = true
    once($('#collabui'), async () => {
      await sleep(1100)
      live.hidden = false
      live.classList.add('fresh')
    }, 0.35)
  }

  // ---------- a merge you can try ----------
  const clash = $('#clash'), mergeBtn = $('#mergeBtn'), out = $('#mergeOut')
  if (clash && mergeBtn) {
    const box = mergeBtn.parentElement
    const reset = () => {
      clash.dataset.state = 'idle'
      box.innerHTML = ''
      box.append(mergeBtn, out)
      mergeBtn.disabled = false
      mergeBtn.textContent = L.merge
      out.textContent = L.tryIt
    }
    mergeBtn.addEventListener('click', async () => {
      mergeBtn.disabled = true
      mergeBtn.innerHTML = `<span class="spin"></span>${L.merge}`
      await sleep(reduce ? 0 : 900)
      clash.dataset.state = 'merged'
      box.innerHTML = `<span class="ok">${L.merged}</span>`
      const tests = document.createElement('button')
      tests.type = 'button'
      tests.className = 'm-btn'
      tests.textContent = L.runTests
      box.append(tests)
      tests.focus({ preventScroll: true })
      tests.addEventListener('click', async () => {
        tests.disabled = true
        tests.innerHTML = `<span class="spin"></span>${L.running}`
        await sleep(reduce ? 0 : 1600)
        clash.dataset.state = 'passed'
        box.innerHTML = `<span class="ok">${L.merged}</span><span class="ok">${L.pass}</span>`
        const again = document.createElement('button')
        again.type = 'button'
        again.className = 'replay mono'
        again.textContent = L.again
        again.style.cssText = 'all:unset;cursor:pointer;color:var(--dim);font:12px var(--mono)'
        again.addEventListener('click', reset)
        box.append(again)
      })
    })
  }
})()
