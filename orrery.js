import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const root = document.getElementById('orrery')
const labels = document.getElementById('labels')
const card = document.getElementById('card')
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const EN = document.documentElement.lang === 'en'

const C = {
  signal: 0xff6a2b,
  bone: 0xece6da,
  go: 0x4fd1a5,
  line: 0x4a505a,
  lineSoft: 0x353a42,
}

// Each agent rides one ring; its tasks cycle so the system feels alive
const AGENTS = [
  { name: 'Frontend', ring: 0, angle: 0.4, tasks: EN ? [['New lobby with the room code on screen', 'Lobby.tsx'], ['Lap counter on the HUD', 'Hud.ts']] : [['Lobby nuevo con el código de sala visible', 'Lobby.tsx'], ['Contador de vueltas en el HUD', 'Hud.ts']] },
  { name: 'Tests', ring: 0, angle: 3.5, tasks: EN ? [['24 tests pass · 91% coverage', 'race.test.ts'], ['Tests for private rooms', 'rooms.test.ts']] : [['24 tests pasan · cobertura 91 %', 'race.test.ts'], ['Tests de las salas privadas', 'rooms.test.ts']], done: true },
  { name: EN ? 'Network' : 'Red', ring: 1, angle: 1.9, tasks: EN ? [['Rooms for 2 to 8 players with a 4-letter code', 'rooms.ts'], ['Reconnect if the network drops', 'socket.ts']] : [['Salas de 2 a 8 jugadores con código de 4 letras', 'rooms.ts'], ['Reconexión si se cae la red', 'socket.ts']] },
  { name: EN ? 'Physics' : 'Física', ring: 1, angle: 5.0, tasks: EN ? [['Interpolation so nobody sees jumps', 'sync.ts'], ['Drift based on speed and angle', 'drift.ts']] : [['Interpolación para que nadie vea saltos', 'sync.ts'], ['Derrape según velocidad y ángulo', 'drift.ts']] },
  { name: EN ? 'Docs' : 'Documentación', ring: 2, angle: 0.9, tasks: EN ? [['Guide: how to create a room and invite', 'ROOMS.md'], ['“Controls” section in the README', 'README.md']] : [['Guía: cómo crear una sala e invitar', 'SALAS.md'], ['Sección «Controles» en el README', 'README.md']], done: true },
  { name: 'Android', ring: 2, angle: 4.1, tasks: EN ? [['Mobile build synced with the online version', 'capacitor.config.json'], ['Icon and splash screen', 'splash.png']] : [['Build móvil sincronizado con la versión online', 'capacitor.config.json'], ['Icono y pantalla de carga', 'splash.png']] },
]
const RINGS = [
  { r: 1.35, tilt: 0.0, speed: 0.16, dashed: true },
  { r: 2.1, tilt: 0.1, speed: -0.1, dashed: true },
  { r: 2.85, tilt: -0.06, speed: 0.065, dashed: false },
]

let renderer
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
} catch {
  root.insertAdjacentHTML('beforeend', `<div class="fallback mono">${EN ? 'Orchestrator + 6 agents in orbit' : 'Orquestador + 6 agentes en órbita'}</div>`)
  throw new Error('WebGL no disponible')
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
root.prepend(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
camera.position.set(0, 5.6, 8.9)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.rotateSpeed = 0.6
controls.minPolarAngle = 0.35
controls.maxPolarAngle = 1.5
controls.autoRotate = !reduce
controls.autoRotateSpeed = 0.35
// OrbitControls sets touch-action:none; keep vertical swipes scrolling the page
renderer.domElement.style.touchAction = 'pan-y'

scene.add(new THREE.AmbientLight(0xffffff, 0.55))
const sunLight = new THREE.PointLight(C.signal, 30, 0, 1.6)
scene.add(sunLight)
const key = new THREE.DirectionalLight(0xffffff, 1.4)
key.position.set(4, 6, 8)
scene.add(key)

// ---------- background stars ----------
{
  const n = 260, pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 6)
    pos.set([v.x, v.y, v.z], i * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x8d8a84, size: 0.045, transparent: true, opacity: 0.7 })))
}

// ---------- sun = orchestrator ----------
const sunMat = new THREE.ShaderMaterial({
  uniforms: { t: { value: 0 }, hot: { value: 0 } },
  vertexShader: `
    varying vec3 vN; varying vec3 vV; varying vec3 vP;
    void main(){
      vP = position;
      vec4 mv = modelViewMatrix * vec4(position,1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform float t; uniform float hot;
    varying vec3 vN; varying vec3 vV; varying vec3 vP;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
    float n3(vec3 p){
      vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
                 mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    void main(){
      vec3 p = vP * 2.4 + vec3(0.0, t*0.12, t*0.05);
      float n = n3(p)*0.55 + n3(p*2.1)*0.3 + n3(p*4.3)*0.15;
      vec3 deep = vec3(0.70,0.24,0.05), mid = vec3(1.0,0.416,0.17), hi = vec3(1.0,0.75,0.55);
      vec3 col = mix(deep, mid, smoothstep(0.25,0.6,n));
      col = mix(col, hi, smoothstep(0.62,0.85,n));
      float fr = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
      col += fr * vec3(1.0,0.55,0.3) * (0.7 + hot*0.8);
      gl_FragColor = vec4(col, 1.0);
    }`,
})
const sun = new THREE.Mesh(new THREE.SphereGeometry(0.55, 64, 64), sunMat)
scene.add(sun)

function glowTexture(stops) {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  for (const [o, col] of stops) gr.addColorStop(o, col)
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
const halo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture([[0, 'rgba(255,106,43,.55)'], [0.35, 'rgba(255,106,43,.12)'], [1, 'rgba(255,106,43,0)']]),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
}))
halo.scale.setScalar(3)
scene.add(halo)

// ---------- rings + satellites ----------
const ringGroups = RINGS.map((R, i) => {
  const g = new THREE.Group()
  g.rotation.x = R.tilt
  g.rotation.z = R.tilt * 0.6
  const pts = []
  for (let k = 0; k <= 256; k++) { const a = (k / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * R.r, 0, Math.sin(a) * R.r)) }
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  const mat = R.dashed
    ? new THREE.LineDashedMaterial({ color: C.line, dashSize: 0.09, gapSize: 0.07, transparent: true, opacity: 0.9 })
    : new THREE.LineBasicMaterial({ color: C.line, transparent: true, opacity: 0.9 })
  const line = new THREE.Line(geo, mat)
  if (R.dashed) line.computeLineDistances()
  g.add(line)
  if (!R.dashed) { // tick marks on the outer ring
    const t = []
    for (let k = 0; k < 72; k++) {
      const a = (k / 72) * Math.PI * 2, l = k % 6 === 0 ? 0.16 : 0.07
      t.push(new THREE.Vector3(Math.cos(a) * R.r, 0, Math.sin(a) * R.r), new THREE.Vector3(Math.cos(a) * (R.r + l), 0, Math.sin(a) * (R.r + l)))
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(t), new THREE.LineBasicMaterial({ color: C.lineSoft })))
  }
  g.userData = { line, mat }
  scene.add(g)
  return g
})

const selRing = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTexture([[0, 'rgba(255,106,43,0)'], [0.55, 'rgba(255,106,43,0)'], [0.62, 'rgba(255,106,43,.9)'], [0.7, 'rgba(255,106,43,0)']]),
  depthWrite: false, transparent: true,
}))
selRing.scale.setScalar(0.62)
selRing.visible = false
scene.add(selRing)

const hitTargets = []
const agents = AGENTS.map((a, idx) => {
  const ring = RINGS[a.ring]
  const mat = new THREE.MeshStandardMaterial({ color: a.done ? C.go : C.bone, emissive: a.done ? C.go : C.bone, emissiveIntensity: 0.25, roughness: 0.45 })
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), mat)
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 12), new THREE.MeshBasicMaterial({ visible: false }))
  hit.userData.agent = idx
  body.add(hit)
  hitTargets.push(hit)
  ringGroups[a.ring].add(body)

  const tag = document.createElement('div')
  tag.className = 'tag'
  labels.append(tag)
  return {
    ...a, body, mat, tag, ringR: ring.r, speed: ring.speed,
    task: 0, progress: a.done ? 1 : 0.15 + Math.random() * 0.5, doneFor: a.done ? 3 + idx : 0,
  }
})
// The orchestrator's name rides an arc just above the sun, in one line
const sunLabel = document.createElement('div')
sunLabel.className = 'sun-label'
sunLabel.innerHTML = `<svg viewBox="0 0 200 200" aria-hidden="true">
  <path id="sunArc" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
  <text><textPath href="#sunArc" startOffset="50%" text-anchor="middle">${EN ? 'ORCHESTRATOR' : 'ORQUESTADOR'}</textPath></text>
</svg>`
labels.append(sunLabel)
const sunEdge = new THREE.Vector3()
hitTargets.push(sun)

function setState(a) {
  const done = a.doneFor > 0
  const color = done ? C.go : C.bone
  a.mat.color.setHex(color); a.mat.emissive.setHex(color)
  const [say, file] = a.tasks[a.task]
  a.tag.classList.toggle('done', done)
  a.tag.innerHTML = `${a.name}<i>${done ? (EN ? 'done' : 'terminado') : (EN ? 'editing ' : 'editando ') + file}</i>`
  a.say = say
}
agents.forEach(setState)

// ---------- card ----------
let hovered = null, selected = null
function showCard() {
  const focus = hovered ?? selected
  root.classList.toggle('focus', focus != null)
  if (focus === 'sun' || focus == null) {
    const working = agents.filter(a => a.doneFor <= 0).length
    card.style.setProperty('--card-dot', 'var(--signal)')
    card.style.setProperty('--p', `${Math.round((agents.length - working) / agents.length * 100)}%`)
    card.innerHTML = EN
      ? `<div class="who">Orchestrator<span class="st">${working} working</span></div>
      <p>Splits your request among ${agents.length} agents and tells you what it will cost before sending.</p>
      <div class="bar"><b></b></div>
      <div class="meta"><span>${agents.length - working} done</span><span>f1-game</span></div>`
      : `<div class="who">Orquestador<span class="st">${working} trabajando</span></div>
      <p>Reparte tu petición entre ${agents.length} agentes y te dice cuánto costará antes de enviar.</p>
      <div class="bar"><b></b></div>
      <div class="meta"><span>${agents.length - working} terminados</span><span>juego F1</span></div>`
    return
  }
  const a = agents[focus], done = a.doneFor > 0
  card.style.setProperty('--card-dot', done ? 'var(--go)' : 'var(--bone)')
  card.style.setProperty('--p', `${Math.round(a.progress * 100)}%`)
  card.innerHTML = `<div class="who">${a.name}<span class="st">${done ? (EN ? 'done' : 'terminado') : (EN ? 'working' : 'trabajando')}</span></div>
    <p>${a.say}</p>
    <div class="bar"><b></b></div>
    <div class="meta"><span>${a.tasks[a.task][1]}</span><span>${Math.round(a.progress * 100)} %</span></div>`
}
showCard()

// ---------- sparks: orchestrator → agent ----------
const sparks = []
const sparkMat = new THREE.SpriteMaterial({
  map: glowTexture([[0, 'rgba(255,220,190,1)'], [0.3, 'rgba(255,106,43,.8)'], [1, 'rgba(255,106,43,0)']]),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
})
function dispatch(a) {
  const s = new THREE.Sprite(sparkMat)
  s.scale.setScalar(0.32)
  scene.add(s)
  sparks.push({ s, a, t: 0 })
}

// ---------- pointer ----------
const ray = new THREE.Raycaster()
const ndc = new THREE.Vector2()
let downAt = null, dragging = false
function pick(e) {
  const r = renderer.domElement.getBoundingClientRect()
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  const hit = ray.intersectObjects(hitTargets, false)[0]
  if (!hit) return null
  return hit.object === sun ? 'sun' : hit.object.userData.agent
}
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; dragging = false })
renderer.domElement.addEventListener('pointermove', e => {
  if (downAt && Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) { dragging = true; root.classList.add('dragging') }
  if (dragging || e.pointerType === 'touch') return
  const h = pick(e)
  if (h !== hovered) { hovered = h; root.classList.toggle('hovering', h != null); showCard() }
})
renderer.domElement.addEventListener('pointerleave', () => { hovered = null; root.classList.remove('hovering'); showCard() })
const endDrag = e => {
  root.classList.remove('dragging')
  if (downAt && !dragging) {
    const h = pick(e)
    selected = h
    if (typeof h === 'number') dispatch(agents[h])
    if (h === 'sun') agents.forEach((a, i) => setTimeout(() => dispatch(a), i * 90))
    showCard()
  }
  downAt = null; dragging = false
}
renderer.domElement.addEventListener('pointerup', endDrag)
renderer.domElement.addEventListener('pointercancel', () => { root.classList.remove('dragging'); downAt = null; dragging = false })

// ---------- sizing & visibility ----------
let W = 0, H = 0
function resize() {
  W = root.clientWidth; H = root.clientHeight
  renderer.setSize(W, H, false)
  camera.aspect = W / H
  camera.updateProjectionMatrix()
}
new ResizeObserver(resize).observe(root)
resize()
let visible = true
new IntersectionObserver(([e]) => { visible = e.isIntersecting }).observe(root)

// ---------- loop ----------
const clock = new THREE.Clock()
const tmp = new THREE.Vector3(), camDir = new THREE.Vector3()
let cardTick = 0
function frame() {
  requestAnimationFrame(frame)
  if (!visible) { clock.getDelta(); return }
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime
  const busy = hovered != null || selected != null

  controls.autoRotate = !reduce && !busy && !dragging
  controls.update()
  sunMat.uniforms.t.value = t
  sunMat.uniforms.hot.value += ((hovered === 'sun' || selected === 'sun' ? 1 : 0) - sunMat.uniforms.hot.value) * 0.1
  halo.scale.setScalar(3 + Math.sin(t * 1.3) * 0.08)

  const sunDist = camera.position.distanceTo(sun.position)
  agents.forEach((a, i) => {
    if (!reduce) a.angle += a.speed * dt * (busy ? 0.25 : 1)
    a.body.position.set(Math.cos(a.angle) * a.ringR, 0, Math.sin(a.angle) * a.ringR)
    const focus = hovered === i || selected === i
    a.body.scale.setScalar(THREE.MathUtils.lerp(a.body.scale.x, focus ? 1.7 : 1, 0.15))

    // work: progress → done for a while → next task
    if (!reduce) {
      if (a.doneFor > 0) {
        a.doneFor -= dt
        if (a.doneFor <= 0) { a.task = (a.task + 1) % a.tasks.length; a.progress = 0; dispatch(a); setState(a) }
      } else {
        a.progress += dt / (22 + i * 4)
        if (a.progress >= 1) { a.progress = 1; a.doneFor = 7; setState(a) }
      }
    }

    a.body.getWorldPosition(tmp)
    const behind = camera.position.distanceTo(tmp) > sunDist + 0.6
    tmp.project(camera)
    const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H
    a.tag.style.transform = `translate(${x + 14}px, ${y - 13}px)`
    a.tag.classList.toggle('hot', focus)
    a.tag.classList.toggle('behind', behind && !focus)
    if (focus) {
      a.body.getWorldPosition(selRing.position)
      selRing.visible = true
    }
  })
  if (hovered == null && selected == null) selRing.visible = false
  if (typeof (hovered ?? selected) !== 'number') selRing.visible = false
  selRing.material.rotation += dt * 0.6

  ringGroups.forEach((g, i) => {
    const hot = [hovered, selected].some(f => typeof f === 'number' && agents[f].ring === i)
    g.userData.mat.color.setHex(hot ? C.signal : C.line)
  })

  for (let k = sparks.length - 1; k >= 0; k--) {
    const sp = sparks[k]
    sp.t += dt / 0.75
    sp.a.body.getWorldPosition(tmp)
    const p = Math.min(sp.t, 1), lift = Math.sin(p * Math.PI) * 0.6
    sp.s.position.set(tmp.x * p, tmp.y * p + lift, tmp.z * p)
    sp.s.material.opacity = 1
    if (sp.t >= 1) { scene.remove(sp.s); sparks.splice(k, 1) }
  }

  tmp.copy(sun.position).project(camera)
  const cx = (tmp.x * 0.5 + 0.5) * W, cy = (-tmp.y * 0.5 + 0.5) * H
  // sun's radius on screen: project a point on its edge, perpendicular to the view
  sunEdge.set(1, 0, 0).applyQuaternion(camera.quaternion).multiplyScalar(0.55).project(camera)
  const rPx = Math.abs((sunEdge.x * 0.5 + 0.5) * W - cx)
  const size = (rPx + 12) * 2 * (100 / 78)
  sunLabel.style.width = sunLabel.style.height = `${size.toFixed(1)}px`
  sunLabel.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
  camera.getWorldDirection(camDir)

  if ((cardTick += dt) > 0.4) { cardTick = 0; showCard() }
  renderer.render(scene, camera)
}
frame()
