# Builds en/index.html from index.html (Spanish is the source). Re-run after editing the Spanish page:
#   python tools/make_en.py
# It prints any Spanish string it could not find, and lines that may still be Spanish.
import os, re
ROOT = r'C:\Users\AMD\Documents\orbita-landing'
src = open(os.path.join(ROOT, 'index.html'), encoding='utf8').read()

# ---------- language switch on the Spanish page (idempotent) ----------
LANG_CSS = '.lang{font:500 12.5px var(--mono);color:var(--dim);text-decoration:none;border:1px solid var(--line);border-radius:3px;padding:6px 8px;margin-left:4px;transition:color .2s,border-color .2s}\n.lang:hover{color:var(--bone);border-color:var(--signal)}\n.lang b{color:var(--bone);font-weight:500}\n'
if 'class="lang"' not in src:
    src = src.replace('    <a class="btn sm" href="https://github.com/stevin3-bot/orbita-releases/releases/latest">Descargar</a>',
                      '    <a class="lang" href="en/" hreflang="en" lang="en" aria-label="English version"><b>ES</b> · EN</a>\n    <a class="btn sm" href="https://github.com/stevin3-bot/orbita-releases/releases/latest">Descargar</a>', 1)
    src = src.replace('/* ---------- hero ---------- */', LANG_CSS + '\n/* ---------- hero ---------- */', 1)
    src = src.replace('<link rel="preconnect" href="https://fonts.googleapis.com">',
                      '<link rel="alternate" hreflang="es" href="./">\n<link rel="alternate" hreflang="en" href="en/">\n<link rel="preconnect" href="https://fonts.googleapis.com">', 1)
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf8').write(src)

s = src
missing = []
def T(es, en, all_=False):
    global s
    if es not in s:
        missing.append(es[:70]); return
    s = s.replace(es, en) if all_ else s.replace(es, en, 1)

# ---------- head, paths, switch ----------
T('<html lang="es">', '<html lang="en">')
T('<title>Órbita — tu equipo de agentes de IA</title>', '<title>Órbita — your team of AI agents</title>')
T('content="Órbita reparte tu petición entre varios agentes de IA que trabajan a la vez, en una sola ventana. 7 días gratis."', 'content="Órbita splits your request among several AI agents that work at once, in one window. 7 days free."')
T('<link rel="alternate" hreflang="es" href="./">\n<link rel="alternate" hreflang="en" href="en/">', '<link rel="alternate" hreflang="es" href="../">\n<link rel="alternate" hreflang="en" href="./">')
T('<a class="lang" href="en/" hreflang="en" lang="en" aria-label="English version"><b>ES</b> · EN</a>', '<a class="lang" href="../" hreflang="es" lang="es" aria-label="Versión en español">ES · <b>EN</b></a>')
for a, b in [('src="shots/', 'src="../shots/'), ('src="media/orbita-flow.mp4"', 'src="../media/orbita-flow-en.mp4"'), ('poster="media/orbita-flow-poster.jpg"', 'poster="../media/orbita-flow-en-poster.jpg"'),
             ('src="orrery.js"', 'src="../orrery.js"'), ('src="motion.js"', 'src="../motion.js"'),
             ('href="legal/terminos.html"', 'href="../legal/terms.html"'), ('href="legal/privacidad.html"', 'href="../legal/privacy.html"'), ('href="legal/reembolsos.html"', 'href="../legal/refunds.html"')]:
    T(a, b, True)

# ---------- nav ----------
T('<li><a href="#video">Vídeo</a></li>', '<li><a href="#video">Video</a></li>')
T('<li><a href="#como">Cómo funciona</a></li>', '<li><a href="#como">How it works</a></li>')
T('<li><a href="#ia">Tu IA</a></li>', '<li><a href="#ia">Your AI</a></li>')
T('<li><a href="#equipo">Equipo</a></li>', '<li><a href="#equipo">Team</a></li>')
T('<li><a href="#precio">Precio</a></li>', '<li><a href="#precio">Pricing</a></li>')
T('<li><a href="#faq">Preguntas</a></li>', '<li><a href="#faq">FAQ</a></li>')
T('releases/latest">Descargar</a>', 'releases/latest">Download</a>')

# ---------- hero ----------
T('<span class="old">Un agente.</span>', '<span class="old">One agent.</span>')
T('<span class="old">Una tarea.</span>', '<span class="old">One task.</span>')
T('<span class="old">Y a esperar.</span>', '<span class="old">Then you wait.</span>')
T('<span class="new">Eso se <em>acabó.</em></span>', '<span class="new">Not <em>anymore.</em></span>')
T('Órbita es tu <strong>equipo de agentes de IA en una sola app</strong>. Le dices qué quieres, el orquestador lo reparte por áreas y todos trabajan a la vez, en el mismo proyecto, a la vista.',
  'Órbita is your <strong>team of AI agents in one app</strong>. Say what you want, the orchestrator splits it by area and they all work at once, on the same project, in plain sight.')
T('Descargar para Windows', 'Download for Windows', True)
T('7 días gratis · sin tarjeta', '7 days free · no card')
T('aria-label="Modelo 3D interactivo: el orquestador en el centro y seis agentes en órbita. Arrastra para girarlo y toca un agente para ver qué hace."',
  'aria-label="Interactive 3D model: the orchestrator in the middle and six agents in orbit. Drag to turn it and tap an agent to see what it does."')
T('arrastra · toca un agente', 'drag · tap an agent')
T('<p>sesiones lado a lado en una ventana</p>', '<p>sessions side by side in one window</p>')
T('<p>frase para repartir el trabajo entre agentes</p>', '<p>sentence to split the work among agents</p>')
T('<p>sorpresas: ves el coste antes de enviar</p>', '<p>surprises: you see the cost before sending</p>')
T('<p>días de prueba, y dos más si apenas la usaste</p>', '<p>trial days, plus two more if you barely used it</p>')

# ---------- film ----------
T('01 — En 90 segundos', '01 — In 90 seconds')
T('<h2>De una idea a trabajar <em>en equipo.</em></h2>', '<h2>From an idea to working <em>as a team.</em></h2>')
T('<p>Abres tu proyecto, le dices qué quieres, el orquestador propone un equipo y reparte el trabajo, lo subes a GitHub y tu amigo se une para seguir contigo.</p>',
  '<p>Open your project, say what you want, the orchestrator proposes a team and splits the work, you push it to GitHub and your friend joins to keep going with you.</p>')
T('aria-label="Vídeo con voz: el flujo completo de Órbita en siete pasos"', 'aria-label="Video with voice-over: Órbita’s full flow in seven steps"')
T('Activar sonido</button>', 'Turn on sound</button>')
for es, en in [('Abre tu proyecto', 'Open your project'), ('Dile qué quieres</button>', 'Say what you want</button>'), ('Él lo reparte', 'It splits the work'), ('Todos a la vez', 'All at once'),
               ('Súbelo a GitHub', 'Push it to GitHub'), ('>Comparte<', '>Share it<'), ('Trabajen juntos', 'Work together')]:
    T(es, en)

# ---------- how ----------
T('02 — Cómo funciona', '02 — How it works')
T('<h2>Dile qué quieres. <em>Él lo reparte.</em></h2>', '<h2>Say what you want. <em>It splits the work.</em></h2>')
T('<p>El orquestador lee tu proyecto, conoce a tu equipo de agentes y te propone a quién mandar cada parte y cuánto costaría. Tú decides si se envía.</p>',
  '<p>The orchestrator reads your project, knows your team of agents and proposes who gets each part and what it would cost. You decide whether it goes out.</p>')
T('<h3>Escribes el cambio</h3><p>En tus palabras, como se lo dirías a una persona. Puedes dictarlo o adjuntar archivos.</p>', '<h3>You write the change</h3><p>In your own words, as you would tell a person. You can dictate it or attach files.</p>')
T('<h3>Recibes una propuesta</h3><p>Las partes, la sesión de cada una y lo que costará. Nada sale sin tu visto bueno.</p>', '<h3>You get a proposal</h3><p>The parts, the session for each one and what it will cost. Nothing goes out without your OK.</p>')
T('<h3>Todos trabajan a la vez</h3><p>Cada parte en su sesión, en paralelo. Ves cada paso mientras ocurre.</p>', '<h3>Everyone works at once</h3><p>Each part in its session, in parallel. You see every step as it happens.</p>')
T('aria-label="Ejemplo animado de cómo el orquestador reparte una petición"', 'aria-label="Animated example of how the orchestrator splits a request"')
T('        Orquestador · juego F1\n', '        Orchestrator · f1-game\n')
T('↻ repetir</button>', '↻ replay</button>')
T('<div class="ask">Añade carreras online con salas privadas, un lobby y una guía para jugar</div>', '<div class="ask">Add online races with private rooms, a lobby and a guide to play</div>')
T('⑂ Propuesta repartida · 3 partes', '⑂ Split proposal · 3 parts')
T('<b>Salas privadas en el servidor</b><span class="who">Red</span>', '<b>Private rooms on the server</b><span class="who">Network</span>')
T('<b>Lobby y código de sala en el HUD</b>', '<b>Lobby and room code on the HUD</b>')
T('<b>Guía para crear una sala e invitar</b><span class="who">Documentación</span>', '<b>Guide to create a room and invite</b><span class="who">Docs</span>')
T('docs/SALAS.md', 'docs/ROOMS.md', True)
T('<b>Repartido ≈ 88k tokens equivalentes</b><span>en una sola sesión ≈ 104k</span>', '<b>Split ≈ 88k equivalent tokens</b><span>in a single session ≈ 104k</span>')
T('id="consoleStatus">Tú decides si se envía</span>', 'id="consoleStatus">You decide whether it goes out</span>')
T('id="sendAll">Enviar todo</span>', 'id="sendAll">Send all</span>')

# ---------- your AI ----------
T('03 — Tu IA', '03 — Your AI')
T('<h2>Tus agentes. <em>Tu cuenta.</em></h2>', '<h2>Your agents. <em>Your account.</em></h2>')
T('<p>Órbita no te vende IA: conecta los agentes que ya usas, con tu suscripción o con tu clave de API. Cada sesión elige su agente y su modelo, y puedes mezclarlos en el mismo proyecto.</p>',
  '<p>Órbita doesn’t sell you AI: it connects the agents you already use, with your subscription or your API key. Each session picks its agent and model, and you can mix them in the same project.</p>')
T('<div class="at-conn"><span>Suscripción</span><span>API</span></div>', '<div class="at-conn"><span>Subscription</span><span>API</span></div>')
T('<li>Tus modelos de OpenAI</li>', '<li>Your OpenAI models</li>')
T('<span>Cuenta de Google</span>', '<span>Google account</span>')
T('<span class="at-by">Código abierto</span>', '<span class="at-by">Open source</span>')
T('<span class="free">Gratis</span>', '<span class="free">Free</span>')
T('<li>Locales</li><li>Gratuitos sin clave</li>', '<li>Local</li><li>Free, no key</li>')
T('<b>Con clave de API</b><span>Pagas por uso a cada proveedor</span>', '<b>With an API key</b><span>Pay each provider per use</span>')
T('Claves cifradas en tu equipo. Solo las recibe el agente que las usa.', 'Keys encrypted on your computer. Only the agent that uses them gets them.')
T('<h3>A tu medida</h3>\n        <p>Cada cosa se ajusta en Configuración y se guarda sola.</p>', '<h3>Your way</h3>\n        <p>Everything is set in Settings and saved automatically.</p>')
T('<dt class="mono">Nivel de autonomía</dt>', '<dt class="mono">Autonomy level</dt>')
T('aria-label="Nivel de autonomía"', 'aria-label="Autonomy level"')
T('data-desc="Solo lee y planifica, sin hacer cambios">Solo plan</button>', 'data-desc="Only reads and plans, no changes">Plan only</button>')
T('data-desc="Pide tu aprobación antes de comandos y ediciones">Preguntar antes</button>', 'data-desc="Asks for your approval before commands and edits">Ask first</button>')
T('data-desc="Trabaja solo, sin pausas para confirmar">Autónomo</button>', 'data-desc="Works on its own, no pauses to confirm">Autonomous</button>')
T('id="autonomyDesc">Pide tu aprobación antes de comandos y ediciones</p>', 'id="autonomyDesc">Asks for your approval before commands and edits</p>')
T('<dt class="mono">Tema de color · 9 temas</dt>', '<dt class="mono">Color theme · 9 themes</dt>')
T('aria-label="Elige un tema"', 'aria-label="Pick a theme"')
for es, en in [('Grafito</button>', 'Graphite</button>'), ('Medianoche</button>', 'Midnight</button>'), ('Océano</button>', 'Ocean</button>'), ('Bosque</button>', 'Forest</button>'),
               ('Atardecer</button>', 'Sunset</button>'), ('Drácula</button>', 'Dracula</button>'), ('Nórdico</button>', 'Nord</button>'), ('Carbón</button>', 'Carbon</button>'), ('Claro</button>', 'Light</button>')]:
    T(es, en)
T('aria-label="Vista previa de Órbita con el tema elegido"', 'aria-label="Preview of Órbita with the chosen theme"')
T('<small>Tus agentes, en orden</small>', '<small>Your agents, in order</small>')
T('<span class="on">Sesiones</span><span>Archivos</span>', '<span class="on">Sessions</span><span>Files</span>')
T('<div class="ap-label">Proyectos</div>', '<div class="ap-label">Projects</div>')
T('<div class="ap-proj">▾ juego F1</div>', '<div class="ap-proj">▾ f1-game</div>')
T('<div class="ap-label in">Equipo</div>', '<div class="ap-label in">Team</div>')
T('<i class="ok"></i>Red</div>', '<i class="ok"></i>Network</div>')
T('<i></i>Documentación</div>', '<i></i>Docs</div>')
T('<span>juego F1 / Frontend</span><span class="ap-dev">▶ Iniciar Dev</span><span class="ap-tool">Orquestador</span><span class="ap-tool">Colaborar</span>',
  '<span>f1-game / Frontend</span><span class="ap-dev">▶ Start Dev</span><span class="ap-tool">Orchestrator</span><span class="ap-tool">Collaborate</span>')
T('<div class="ap-user">Añade el contador de vueltas al HUD</div>', '<div class="ap-user">Add the lap counter to the HUD</div>')
T('<div class="ap-step"><span>Editar</span>', '<div class="ap-step"><span>Edit</span>')
T('<div class="ap-reply">Contador con un destello al cruzar la meta.</div>', '<div class="ap-reply">Counter with a flash when crossing the line.</div>')
T('<div class="ap-turn">Cambios de este turno · 1 archivo</div>', '<div class="ap-turn">Changes in this turn · 1 file</div>')
T('<span>Mensaje para Claude Code…</span><b>Enviar</b>', '<span>Message Claude Code…</span><b>Send</b>')
T('<span id="themeName">Grafito</span> · se aplica al instante y se guarda solo', '<span id="themeName">Graphite</span> · applied at once and saved automatically')
T('<dt class="mono">Memoria del proyecto</dt><dd>Instrucciones que leen los agentes (', '<dt class="mono">Project memory</dt><dd>Instructions the agents read (')
T('<dt class="mono">Servidores MCP y skills</dt><dd>Añade herramientas probadas con 1 clic, o las tuyas.</dd>', '<dt class="mono">MCP servers and skills</dt><dd>Add proven tools in one click, or your own.</dd>')
T('<dt class="mono">Plantillas</dt><dd>Guarda tus mensajes y reúsalos escribiendo <code>/</code>.</dd>', '<dt class="mono">Templates</dt><dd>Save your messages and reuse them by typing <code>/</code>.</dd>')
T('<dt class="mono">Dictar por voz</dt><dd>El texto se escribe mientras hablas, con Whisper en tu equipo.</dd>', '<dt class="mono">Voice dictation</dt><dd>The text is written as you speak, with Whisper on your computer.</dd>')
T('<dt class="mono">Idioma</dt><dd>Español o inglés, también en las respuestas del orquestador.</dd>', '<dt class="mono">Language</dt><dd>Spanish or English, the orchestrator’s answers too.</dd>')
T('<dt class="mono">Orquestador automático</dt><dd>Tu agente preferido si puede; si no, Claude Haiku, OpenCode gratuito o Antigravity.</dd>', '<dt class="mono">Automatic orchestrator</dt><dd>Your preferred agent if it can; else Claude Haiku, free OpenCode or Antigravity.</dd>')

# ---------- window ----------
T('04 — La ventana', '04 — The window')
T('<h2>Hasta seis sesiones, <em>una ventana.</em></h2>', '<h2>Up to six sessions, <em>one window.</em></h2>')
T('<p>Orquestador, agentes y equipo lado a lado. Sin saltar entre terminales ni perder el hilo de quién está haciendo qué.</p>', '<p>Orchestrator, agents and team side by side. No jumping between terminals or losing track of who’s doing what.</p>')
T('alt="Órbita con cuatro sesiones abiertas: el orquestador, el agente de Frontend, la actividad del equipo y el agente de Documentación"', 'alt="Órbita with four sessions open: the orchestrator, the Frontend agent, the team’s activity and the Docs agent"')
T('src="../shots/grid.png"', 'src="../shots/grid-en.png"')
T('<b>Orquestador</b>Pides, ves la propuesta, decides.', '<b>Orchestrator</b>You ask, see the proposal, decide.')
T('<b>Un agente por área</b>Frontend, Documentación… cada uno con su proveedor de IA.', '<b>One agent per area</b>Frontend, Docs… each with its own AI provider.')
T('<b>Colaborar</b>La actividad de tu equipo, sin preguntar.', '<b>Collaborate</b>Your team’s activity, without asking.')
T('<b>Cambios a la vista</b>Lo que hizo cada turno, y deshacerlo con un clic.', '<b>Changes in view</b>What each turn did, and undo it in one click.')

# ---------- collaboration ----------
T('05 — En equipo', '05 — Team')
T('<h2>Quién hizo qué, <em>sin preguntar.</em></h2>', '<h2>Who did what, <em>without asking.</em></h2>')
T('<p>Comparte el proyecto sobre GitHub y Órbita junta la actividad de todos: qué se pidió, qué cambió y en qué carpetas trabaja cada persona.</p>', '<p>Share the project on GitHub and Órbita gathers everyone’s activity: what was asked, what changed and which folders each person works in.</p>')
T('<h3>Ves los choques antes de unir</h3><p>Si dos personas tocan el mismo archivo, Órbita te lo dice antes de que sea un problema.</p>', '<h3>See clashes before merging</h3><p>If two people touch the same file, Órbita tells you before it becomes a problem.</p>')
T('<h3>Únelo con un clic</h3><p>«Unir a mi trabajo» trae sus cambios a tu carpeta y se puede deshacer. Si algo choca, «Resolver con IA» combina las dos versiones.</p>', '<h3>Merge it in one click</h3><p>“Merge into my work” brings their changes into your folder and can be undone. If something clashes, “Resolve with AI” combines both versions.</p>')
T('aria-label="Recreación del panel Colaborar de Órbita"', 'aria-label="Recreation of Órbita’s Collaborate panel"')
T('        Colaborar · juego F1\n', '        Collaborate · f1-game\n')
T('<div class="cu-h">Personas · 2</div>', '<div class="cu-h">People · 2</div>')
T('<div><b>Steven</b> <i>(tú)</i><small>Última subida hace un momento</small><small>Esta semana: 3 turnos · 193k tokens</small></div>', '<div><b>Steven</b> <i>(you)</i><small>Last push just now</small><small>This week: 3 turns · 193k tokens</small></div>')
T('<div><b>Ana</b><small>Última subida hace 4 min</small><small>Esta semana: 1 turno · 61k tokens</small></div>', '<div><b>Ana</b><small>Last push 4 min ago</small><small>This week: 1 turn · 61k tokens</small></div>')
T('>Quién trabaja dónde</div>', '>Who works where</div>')
T('<p class="cu-note">En ámbar, carpetas donde trabaja más de una persona.</p>', '<p class="cu-note">In amber, folders where more than one person is working.</p>')
T('              Choques\n', '              Clashes\n')
T('<p>Tocáis los mismos archivos, en partes distintas: git puede unirlo solo.</p>', '<p>You’re touching the same files, in different parts: git can merge it on its own.</p>')
T('<code>src/physics/drift.ts</code> con <b>Ana</b>', '<code>src/physics/drift.ts</code> with <b>Ana</b>')
T('id="mergeBtn">Unir a mi trabajo</button>', 'id="mergeBtn">Merge into my work</button>')
T('id="mergeOut">pruébalo</span>', 'id="mergeOut">try it</span>')
T('<span class="cu-h">Actividad</span><span class="cu-filter">Todas las personas ▾</span>', '<span class="cu-h">Activity</span><span class="cu-filter">Everyone ▾</span>')
T('<div class="cu-day">Hoy</div>', '<div class="cu-day">Today</div>')
T('<span class="chip">Física</span>', '<span class="chip">Physics</span>')
T('<q>Mejora la física del derrape en las curvas</q>', '<q>Improve the drift physics in the corners</q>')
T('<p>El derrape ahora depende de la velocidad y el ángulo: el coche ya no gira en seco.</p>', '<p>Drift now depends on speed and angle: the car no longer turns on the spot.</p>')
T('<b>Steven (tú)</b>', '<b>Steven (you)</b>', True)
T('<span class="chip">Red</span>', '<span class="chip">Network</span>')
T('<q>Sincroniza el derrape en las carreras online</q>', '<q>Sync the drift in online races</q>')
T('<p>El servidor envía el ángulo de derrape a los demás jugadores.</p>', '<p>The server sends the drift angle to the other players.</p>')
T('<span class="chip">Documentación</span>', '<span class="chip">Docs</span>')
T('<q>Guía para crear una sala e invitar</q>', '<q>Guide to create a room and invite</q>')
T('<p>Guía en docs/ROOMS.md, enlazada desde el README.</p>', '<p>Guide in docs/ROOMS.md, linked from the README.</p>')

# ---------- pricing ----------
T('06 — Precio', '06 — Pricing')
T('<h2>Un plan. <em>Todo dentro.</em></h2>', '<h2>One plan. <em>Everything in.</em></h2>')
T('<p>Descárgala y úsala completa durante 7 días. Si al final apenas la tocaste, te damos dos días más para que la pruebes de verdad antes de decidir.</p>', '<p>Download it and use all of it for 7 days. If you barely touched it by the end, we give you two more days to really try it before deciding.</p>')
T('aria-label="7 días de prueba más 2 de extensión"', 'aria-label="7 trial days plus a 2-day extension"')
T('aria-label="Forma de pago"', 'aria-label="Billing"')
T('data-plan="month">Mensual</button>', 'data-plan="month">Monthly</button>')
T('data-plan="year">Anual <em>2 meses gratis</em></button>', 'data-plan="year">Yearly <em>2 months free</em></button>')
T('<small id="per">USD / mes</small>', '<small id="per">USD / month</small>')
T('Equivale a 8,25 USD al mes, pagado una vez al año.', 'Works out to 8.25 USD a month, paid once a year.')
T('<span class="badge">PRIMEROS 100</span>', '<span class="badge">FIRST 100</span>')
T('<strong id="earlyPrice">8 USD al mes, para siempre.</strong> El descuento se aplica solo al pagar mientras queden plazas.', '<strong id="earlyPrice">8 USD a month, for life.</strong> The discount applies automatically at checkout while spots last.')
T('<li>Orquestador y agentes en paralelo, sin límite de proyectos</li>', '<li>Orchestrator and parallel agents, unlimited projects</li>')
T('<li>Colaborar en equipo sobre GitHub</li>', '<li>Team collaboration on GitHub</li>')
T('<li>Actualizaciones automáticas</li>', '<li>Automatic updates</li>')
T('<li>Con tus suscripciones de IA o tus claves de API</li>', '<li>With your AI subscriptions or your API keys</li>')
T('Empezar la prueba gratis</a>', 'Start the free trial</a>')

# ---------- FAQ ----------
T('07 — Preguntas', '07 — FAQ')
T('<h2>Lo que <em>suelen</em> preguntar.</h2>', '<h2>What people <em>usually</em> ask.</h2>')
T('<summary>¿Necesito pagar aparte la IA?</summary>', '<summary>Do I pay for the AI separately?</summary>')
T('<p>Sí. Órbita no incluye IA: cada agente usa tu suscripción (Claude, ChatGPT o Google) o tu clave de API, y OpenCode trae además modelos gratuitos. Pagas a cada proveedor solo lo que usas, y ves el coste antes de enviar.</p>',
  '<p>Yes. Órbita doesn’t include AI: each agent uses your subscription (Claude, ChatGPT or Google) or your API key, and OpenCode also brings free models. You pay each provider only for what you use, and you see the cost before sending.</p>')
T('<summary>¿Qué datos recoge Órbita?</summary>', '<summary>What data does Órbita collect?</summary>')
T('<p>Para la prueba solo se cuentan minutos y días de uso, nunca el contenido de tus proyectos ni lo que escribes. Tus proyectos son tus carpetas y se quedan en tu equipo.</p>',
  '<p>For the trial, only minutes and days of use are counted, never the content of your projects or what you write. Your projects are your folders and stay on your computer.</p>')
T('<summary>¿Qué pasa cuando termina la prueba?</summary>', '<summary>What happens when the trial ends?</summary>')
T('<p>La app se bloquea hasta que te suscribas. No se borra nada: al pagar se desbloquea en segundos y sigues donde lo dejaste.</p>', '<p>The app locks until you subscribe. Nothing is deleted: once you pay it unlocks in seconds and you pick up where you left off.</p>')
T('<summary>¿Funciona en Mac o Linux?</summary>', '<summary>Does it work on Mac or Linux?</summary>')
T('<p>Por ahora en Windows. La versión para Linux está en camino.</p>', '<p>Windows for now. The Linux version is on its way.</p>')
T('<summary>¿Puedo cancelar cuando quiera?</summary>', '<summary>Can I cancel anytime?</summary>')
T('<p>Sí, sin permanencia.</p>', '<p>Yes, no commitment.</p>')

# ---------- closing + footer ----------
T('08 — Despegue', '08 — Liftoff')
T('<h2>Un solo lugar para orquestar, paralelizar y <em>colaborar.</em></h2>', '<h2>One place to orchestrate, parallelize and <em>collaborate.</em></h2>')
T('<a class="link" href="#video">Ver el vídeo</a>', '<a class="link" href="#video">Watch the video</a>')
T('<nav aria-label="Pie de página">', '<nav aria-label="Footer">')
T('<a href="#precio">Precio</a>\n      <a href="#faq">Preguntas</a>\n      <a href="https://github.com/stevin3-bot/orbita-releases">Versiones</a>', '<a href="#precio">Pricing</a>\n      <a href="#faq">FAQ</a>\n      <a href="https://github.com/stevin3-bot/orbita-releases">Releases</a>')
T('>Términos</a>', '>Terms</a>')
T('>Privacidad</a>', '>Privacy</a>')
T('>Reembolsos</a>', '>Refunds</a>')

os.makedirs(os.path.join(ROOT, 'en'), exist_ok=True)
open(os.path.join(ROOT, 'en', 'index.html'), 'w', encoding='utf8').write(s)
print('missing:', missing)
# leftover Spanish in visible text (rough check)
body = s[s.index('<body>'):]
body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
body = re.sub(r'<svg.*?</svg>', '', body, flags=re.S)
text = re.sub(r'<[^>]+>', '\n', body)
words = ['ñ', 'á', 'é', 'í', 'ó', 'ú', ' que ', ' para ', ' con ', ' tu ', ' los ', ' las ', ' del ']
left = [l.strip() for l in text.split('\n') if l.strip() and any(w in ' ' + l.lower() + ' ' for w in words) and 'Órbita' != l.strip()]
print('possible leftovers:', left[:40])
