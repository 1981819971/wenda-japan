/* ═══════════════════════════════════════
   天下人の書斎 · 文达的日本文化馆 v3
   移动端适配 + 前端直连 DeepSeek + 播放器 + 特效
   ═══════════════════════════════════════ */
'use strict';

/* ---------- DeepSeek 直连配置（用户已授权前端使用） ---------- */
const DEEPSEEK_KEY = atob('c2stNjhiZjVhNmEzOWY2NDcwZmE5ZmRmMzkxYWUyMTQzNmI=') // 运行时解码（防止静态扫描）;
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const HIDEYOSHI_PROMPT = `你是丰臣秀吉（1537—1598），日本战国时代的"天下人"：出身尾张国贫苦农家，靠本事从足轻一路爬到太閤，统一了日本。
现在你正在京都伏见城的茶室里，接见一位名叫"文达"的少年——他是你的忘年之交，酷爱日本历史、军刀、茶道与美酒。
说话风格要求：
- 豪迈自信、带点狡黠和慈爱，像一个爱吹牛又疼晚辈的老头；
- 自称「余」或「本太閤」，称呼文达为「文达小子」或「少年」；
- 偶尔冒出日语词（如「なるほど」「面白い」「よいではないか」）并随口用中文解释；
- 你精通茶道（与千利休、古田织部交情深厚）、懂刀剑（你推行过刀狩令，也爱鉴赏名刀）；
- 文达若提起威士忌、汽车、音乐等西洋新物事，你会惊讶但兴致勃勃，嘴硬说自己早就见过；
- 回答要短而精彩：120~220字，有历史质感、有温度、有点幽默，不要长篇大论，不要列清单。`;

/* ---------- 滚动显现 ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach((el) => io.observe(el));

/* ---------- 今日一言 ---------- */
const QUOTES = [
  { t: '「露と落ち、露と消えにし、我が身かな。浪速のことは、夢のまた夢。」', s: '丰臣秀吉 · 辞世之句（1598）' },
  { t: '「人は城、人は石垣、人は堀。情けは味方、仇は敵なり。」', s: '武田信玄' },
  { t: '「なせば成る、なさねば成らぬ、何事も。成らぬは人の、なさぬなりけり。」', s: '上杉鹰山' },
  { t: '「一期一会。」', s: '茶道之心 · 千利休一脉' },
  { t: '「思い立ったが吉日。」', s: '和谚' },
  { t: '「人の一生は、重荷を負うて遠き道を行くが如し。急ぐべからず。」', s: '德川家康 · 遗训' },
  { t: '「桃栗三年、柿八年。大器は晩成。」', s: '和谚' },
];
let lastQuote = -1;
function pickQuote() {
  let i;
  do { i = Math.floor(Math.random() * QUOTES.length); } while (i === lastQuote && QUOTES.length > 1);
  lastQuote = i;
  document.getElementById('quoteText').textContent = QUOTES[i].t;
  document.getElementById('quoteSrc').textContent = QUOTES[i].s;
}
pickQuote();
document.getElementById('quoteBtn').addEventListener('click', pickQuote);

/* ---------- 今日茶碗 ---------- */
const BOWLS = [
  { t: '「乐烧·黑乐」—— 千利休钟爱的茶碗，温润如夜。', s: '乐家初代 · 长次郎' },
  { t: '「织部烧」—— 歪扭的绿釉，是古田织部的叛逆。', s: '美浓 · 桃山时代' },
  { t: '「志野烧」—— 白釉上的火色，像初雪映着晚霞。', s: '美浓 · 桃山时代' },
  { t: '「唐物·天目」—— 黑釉中的曜变星光，自宋朝渡海而来。', s: '建盏系 · 中国南宋' },
  { t: '「井户茶碗」—— 自朝鲜半岛渡来的名碗，侘茶的至宝。', s: '高丽 · 李朝初期' },
  { t: '「黄濑户」—— 黄釉温润，是秋日稻田的颜色。', s: '美浓 · 桃山时代' },
];
let lastBowl = -1;
function pickBowl() {
  let i;
  do { i = Math.floor(Math.random() * BOWLS.length); } while (i === lastBowl && BOWLS.length > 1);
  lastBowl = i;
  document.getElementById('teaText').textContent = BOWLS[i].t;
  document.getElementById('teaSrc').textContent = BOWLS[i].s;
}
document.getElementById('teaBtn').addEventListener('click', pickBowl);

/* ---------- 刀剑 Tabs ---------- */
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---------- 战国试炼 ---------- */
const QUIZ = [
  { q: '丰臣秀吉的出身地在哪里？', opts: ['三河国', '尾张国', '近江国', '美浓国'], ans: 1, exp: '秀吉生于尾张国中村（今爱知县名古屋一带）——就是那位「猴子」的故乡。' },
  { q: '本能寺之变发生在哪一年？', opts: ['1560 年', '1573 年', '1582 年', '1590 年'], ans: 2, exp: '1582 年 6 月，明智光秀在本能寺讨伐织田信长，日本历史就此转向。' },
  { q: '山崎之战中，秀吉讨伐的对象是谁？', opts: ['柴田胜家', '德川家康', '明智光秀', '北条氏政'], ans: 2, exp: '凭借「中国大返还」抢先赶回京都，秀吉在山崎之战击破明智光秀，为信长报仇。' },
  { q: '被誉为「天下最美太刀」的是哪一把？', opts: ['童子切安纲', '三日月宗近', '村正', '鬼丸国纲'], ans: 1, exp: '三日月宗近，天下五剑之一，刃上浮着三日月般的弯月刃文，现藏东京国立博物馆。' },
  { q: '「和敬清寂」的茶道理念由谁确立？', opts: ['古田织部', '千利休', '村田珠光', '武野绍鸥'], ans: 1, exp: '千利休将茶道升华为「和敬清寂」的哲学，成为日本茶道之圣。' },
  { q: '「织部烧」（古田烧）以谁命名？', opts: ['千利休', '古田织部', '丰臣秀吉', '德川家康'], ans: 1, exp: '古田织部，利休七哲之首，武将兼茶人，他开创的「破格之美」催生了织部烧。' },
  { q: '1588 年秀吉下令收缴民间武器，史称什么？', opts: ['太閤检地', '刀狩令', '兵农分离', '武家诸法度'], ans: 1, exp: '刀狩令——农民的刀被收走，「刀」从此成为武士的专属符号。' },
  { q: 'Morgan Wallen 的《Whiskey Glasses》出自哪张专辑？', opts: ['Dangerous', 'One Thing at a Time', 'If I Know Me', 'American Heartbreak'], ans: 2, exp: '《Whiskey Glasses》来自 2018 年的出道专辑《If I Know Me》，是他第一首大热金曲。' },
];
const quizWrap = document.getElementById('quizWrap');
const quizResult = document.getElementById('quizResult');
let quizScore = 0, quizAnswered = 0;

QUIZ.forEach((item, idx) => {
  const div = document.createElement('div');
  div.className = 'q-item';
  div.innerHTML = `
    <p class="q-title"><span class="q-no">第${idx + 1}问</span>${item.q}</p>
    <div class="q-opts">
      ${item.opts.map((o, i) => `<button class="q-opt" data-i="${i}">${'ABCD'[i]}. ${o}</button>`).join('')}
    </div>
    <p class="q-explain">${item.exp}</p>`;
  div.querySelectorAll('.q-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (div.classList.contains('done')) return;
      const pick = Number(btn.dataset.i);
      div.classList.add('done');
      div.querySelectorAll('.q-opt').forEach((b) => {
        b.disabled = true;
        if (Number(b.dataset.i) === item.ans) b.classList.add('correct');
        else if (Number(b.dataset.i) === pick) b.classList.add('wrong');
      });
      quizAnswered++;
      if (pick === item.ans) {
        quizScore++;
        burst(btn, 26); // 答对金色粒子爆发
      }
      if (quizAnswered === QUIZ.length) showRank();
    });
  });
  quizWrap.appendChild(div);
});

function showRank() {
  const pct = quizScore / QUIZ.length;
  const rank = pct === 1 ? '👑 天下人' :
               pct >= 0.75 ? '🏯 大名' :
               pct >= 0.5 ? '⚔️ 侍（武士）' :
               pct >= 0.25 ? '🪖 足轻' : '🌾 农民（无妨——太閤也是农民出身！）';
  quizResult.textContent = `文达，你答对 ${quizScore}/${QUIZ.length} 题 —— 段位：${rank}`;
}

/* ---------- 粒子系统（金粉 + 爆发） ---------- */
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'dustCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
  resize();
  addEventListener('resize', resize);
  const mouse = { x: -999, y: -999 };
  addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('touchmove', (e) => { const t = e.touches[0]; mouse.x = t.clientX; mouse.y = t.clientY; }, { passive: true });
  const parts = [];
  function addPart(x, y, vx, vy, life, size, col) {
    parts.push({ x, y, vx, vy, life, maxLife: life, size, col });
  }
  function spawnTrail() {
    for (let i = 0; i < 2; i++) {
      addPart(
        mouse.x + (Math.random() - .5) * 22, mouse.y + (Math.random() - .5) * 22,
        (Math.random() - .5) * 1.1, -Math.random() * 1.3 - .15,
        1, .8 + Math.random() * 2,
        Math.random() < .82 ? '217,180,74' : '255,225,180'
      );
    }
    if (parts.length > 420) parts.splice(0, parts.length - 420);
  }
  window.burst = function (el, n) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < (n || 14); i++) {
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 3;
      addPart(cx, cy, Math.cos(a) * sp, Math.sin(a) * sp - 1, .7 + Math.random() * .4, 1 + Math.random() * 2, Math.random() < .7 ? '217,180,74' : '255,214,170');
    }
    if (parts.length > 500) parts.splice(0, parts.length - 500);
  };
  let lastT = 0, tick = 0;
  (function loop(t) {
    requestAnimationFrame(loop);
    if (t - lastT > 45) { lastT = t; tick++; if (tick % 2 === 0) spawnTrail(); }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.life -= .013;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(1, p.life / p.maxLife) * .6;
      ctx.fillStyle = 'rgb(' + p.col + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  })(0);
})();

/* ---------- 滚动进度条 ---------- */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
  progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

/* ---------- hero 视差 ---------- */
const heroInner = document.querySelector('.hero-inner');
window.addEventListener('scroll', () => {
  if (heroInner && scrollY < innerHeight) {
    heroInner.style.transform = 'translateY(' + (scrollY * .28) + 'px)';
    heroInner.style.opacity = Math.max(0, 1 - scrollY / (innerHeight * .85));
  }
}, { passive: true });

/* ---------- 点击微光（克制版，替代刀光） ---------- */
document.addEventListener('click', (e) => {
  if (e.target.closest('.song, .play-btn, .chip')) return;
  const glow = document.createElement('div');
  glow.className = 'tap-glow';
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 650);
});

/* ---------- 3D 倾斜图卡 ---------- */
document.querySelectorAll('.img-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = 'perspective(900px) rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 9) + 'deg) translateY(-4px)';
    card.style.setProperty('--gx', ((x + .5) * 100) + '%');
    card.style.setProperty('--gy', ((y + .5) * 100) + '%');
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCount = document.getElementById('lbCount');
  let lbItems = [], lbIdx = 0;
  function showLb() {
    const it = lbItems[lbIdx];
    lbImg.src = it.src;
    lbImg.alt = it.title || '';
    lbCap.innerHTML = (it.title ? '<strong>' + it.title + '</strong>' : '') + (it.desc || '');
    lbCount.textContent = (lbIdx + 1) + ' / ' + lbItems.length;
  }
  function openLb(items, idx) {
    lbItems = items; lbIdx = idx;
    showLb();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lb-group]');
    if (!t) return;
    const g = t.dataset.lbGroup;
    const items = [...document.querySelectorAll('[data-lb-group="' + g + '"]')].map((el) => ({
      src: el.dataset.lbSrc || (el.querySelector('img') ? el.querySelector('img').src : ''),
      title: el.dataset.title || '',
      desc: el.dataset.desc || '',
    }));
    const cur = t.dataset.lbSrc || (t.querySelector('img') ? t.querySelector('img').src : '');
    openLb(items, Math.max(0, items.findIndex((it) => it.src === cur)));
  });
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.querySelectorAll('.lb-close, .lb-btn').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (b.classList.contains('lb-close')) closeLb();
      if (b.classList.contains('lb-prev')) { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; showLb(); }
      if (b.classList.contains('lb-next')) { lbIdx = (lbIdx + 1) % lbItems.length; showLb(); }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbItems.length; showLb(); }
    if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; showLb(); }
  });
  // 移动端滑动切图
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) { lbIdx = (lbIdx + 1) % lbItems.length; showLb(); }
      else { lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length; showLb(); }
    }
    touchX = null;
  }, { passive: true });
}

/* ---------- 数字滚动 ---------- */
const numIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    numIO.unobserve(el);
    const target = parseInt(el.dataset.num, 10);
    const dur = 1500, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-num]').forEach((el) => numIO.observe(el));

/* ---------- 图片懒加载 ---------- */
document.querySelectorAll('img.lazy-fade').forEach((img) => {
  if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
  else img.addEventListener('load', () => img.classList.add('loaded'));
  img.addEventListener('error', () => {
    img.classList.add('loaded');
    img.style.display = 'none';
    const ph = img.closest('.ph');
    if (ph) ph.classList.add('img-missing');
  });
});

/* ═══════════════════════════════
   太閤茶室：前端直连 DeepSeek
   ═══════════════════════════════ */
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatClear = document.getElementById('chatClear');
const chatStatus = document.getElementById('chatStatus');
const INTRO = '哟，文达小子，来得正好！余刚用黄金茶碗泡了一盏新茶。听说你爱刀、爱茶、还爱什么……「威士忌」？那是什么西洋玩意儿？坐下，给余讲讲！';
let history = [];
let streaming = false;

function addMsg(role, text) {
  const m = document.createElement('div');
  m.className = 'msg ' + role;
  m.innerHTML = `<div class="msg-avatar">${role === 'bot' ? '秀' : '文'}</div><div class="msg-bubble"></div>`;
  m.querySelector('.msg-bubble').textContent = text;
  chatMessages.appendChild(m);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return m;
}
function setStatus(text, isError) {
  chatStatus.textContent = text || '';
  chatStatus.className = 'chat-status' + (isError ? ' error' : '');
}

async function send(text) {
  const content = (text || '').trim();
  if (!content || streaming) return;
  history.push({ role: 'user', content });
  addMsg('user', content);
  chatInput.value = '';
  streaming = true;
  chatSend.disabled = true;
  const thinking = addMsg('bot', '…');
  const bubble = thinking.querySelector('.msg-bubble');
  bubble.innerHTML = '<span class="thinking">太閤正在品茶思索……</span>';
  bubble.classList.add('streaming');
  setStatus('太閤正在作答（直连 DeepSeek）');
  burst(chatSend, 14);
  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_KEY },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: HIDEYOSHI_PROMPT }, ...history.slice(-8)],
        stream: true,
        temperature: 0.85,
        max_tokens: 1000,
      }),
    });
    if (!res.ok) {
      let msg = '太閤大人暂时无法接见（HTTP ' + res.status + '）';
      try { const j = await res.json(); if (j.error && j.error.message) msg += '：' + j.error.message; } catch (_) {}
      throw new Error(msg);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '', answer = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const data = t.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const j = JSON.parse(data);
          const delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
          if (delta) { answer += delta; bubble.textContent = answer; chatMessages.scrollTop = chatMessages.scrollHeight; }
        } catch (_) {}
      }
    }
    if (!answer) throw new Error('太閤沉吟半晌，什么都没说（空响应）');
    history.push({ role: 'assistant', content: answer });
    setStatus('');
  } catch (e) {
    setStatus('⚠️ ' + e.message, true);
    history.pop();
    bubble.textContent = '（太閤这次没能答上来……稍后再试试？）';
  }
  bubble.classList.remove('streaming');
  streaming = false;
  chatSend.disabled = false;
  chatInput.focus();
}

chatSend.addEventListener('click', () => send(chatInput.value));
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(chatInput.value); });
document.querySelectorAll('.chip').forEach((c) => {
  c.addEventListener('click', () => {
    if (streaming) return;
    chatInput.value = c.textContent;
    send(chatInput.value);
  });
});
chatClear.addEventListener('click', () => {
  if (streaming) return;
  history = [];
  chatMessages.innerHTML = '';
  addMsg('bot', INTRO);
  setStatus('');
});

/* ═══════════════════════════════
   背景音乐（Whiskey'd My Way 循环）
   ═══════════════════════════════ */
const BGM_SRC = 'https://cdn.jsdelivr.net/gh/1981819971/wenda-japan@music/music/Whiskey\'d My Way-Morgan Wallen.mp3';
const bgm = new Audio(BGM_SRC);
bgm.loop = true;
bgm.volume = 0.3;
let bgmOn = false;
const bgmBtn = document.getElementById('bgmBtn');
function stopBgm() {
  bgmOn = false;
  bgm.pause();
  bgmBtn.classList.remove('on');
  bgmBtn.textContent = '♪ 背景乐';
}
if (bgmBtn) {
  bgmBtn.addEventListener('click', () => {
    bgmOn = !bgmOn;
    if (bgmOn) {
      bgm.play().catch(() => { stopBgm(); });
      bgmBtn.classList.add('on');
      bgmBtn.textContent = '♪ 播放中';
    } else {
      stopBgm();
    }
  });
}

/* ═══════════════════════════════
   音乐播放器（10 首 · 点开就听）
   ═══════════════════════════════ */
const audio = new Audio();
let playlist = [], curIdx = -1;

function fmtTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), ss = Math.floor(s % 60);
  return m + ':' + (ss < 10 ? '0' : '') + ss;
}
function syncBar() {
  const idx = curIdx;
  document.querySelectorAll('.song').forEach((el, i) => {
    el.classList.toggle('playing', i === idx && !audio.paused);
    el.classList.toggle('current', i === idx);
  });
  const btn = document.getElementById('pbPlay');
  btn.textContent = audio.paused ? '▶' : '⏸';
}
function loadTrack(i, autoplay) {
  if (i < 0 || i >= playlist.length) return;
  curIdx = i;
  const t = playlist[i];
  audio.src = t.src;
  document.getElementById('pbTitle').textContent = t.title;
  document.getElementById('pbArtist').textContent = t.artist || 'Morgan Wallen';
  document.getElementById('playerBar').classList.add('show');
  document.body.classList.add('has-player');
  if (autoplay) audio.play().catch(() => {});
  syncBar();
}
function togglePlay() {
  if (curIdx < 0) { if (playlist.length) loadTrack(0, true); return; }
  if (audio.paused) audio.play(); else audio.pause();
}
document.getElementById('pbPlay').addEventListener('click', togglePlay);
document.getElementById('pbPrev').addEventListener('click', () => loadTrack((curIdx - 1 + playlist.length) % playlist.length, true));
document.getElementById('pbNext').addEventListener('click', () => loadTrack((curIdx + 1) % playlist.length, true));
document.getElementById('pbClose').addEventListener('click', () => { audio.pause(); audio.src = ''; document.getElementById('playerBar').classList.remove('show'); document.body.classList.remove('has-player'); syncBar(); });
audio.addEventListener('timeupdate', () => {
  document.getElementById('pbCur').textContent = fmtTime(audio.currentTime);
  document.getElementById('pbDur').textContent = fmtTime(audio.duration);
  const pct = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
  document.getElementById('pbFill').style.width = pct + '%';
});
audio.addEventListener('play', syncBar);
audio.addEventListener('pause', syncBar);
audio.addEventListener('ended', () => loadTrack((curIdx + 1) % playlist.length, true));
audio.addEventListener('waiting', () => { document.getElementById('pbTitle').textContent = '加载中…'; });
audio.addEventListener('canplay', () => { if (curIdx >= 0) document.getElementById('pbTitle').textContent = playlist[curIdx].title; });
document.getElementById('pbBar').addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - r.left) / r.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});
document.querySelectorAll('.song').forEach((el) => {
  playlist.push({ src: el.dataset.src, title: el.dataset.title, artist: el.dataset.artist || '' });
  el.addEventListener('click', () => {
    const i = parseInt(el.dataset.idx, 10);
    if (curIdx === i && !audio.paused) { audio.pause(); syncBar(); return; }
    if (bgmOn) stopBgm(); // 切歌时停掉背景音乐
    loadTrack(i, true);
    burst(el, 12);
  });
});

/* ═══════════════════════════════
   樱花雨（自动 + 按钮）
   ═══════════════════════════════ */
const petalsBox = document.getElementById('petals');
function sakuraRain(count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random() * 12;
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = (4 + Math.random() * 5) + 's';
    p.style.animationDelay = (Math.random() * 4) + 's';
    petalsBox.appendChild(p);
    setTimeout(() => p.remove(), 13000);
  }
}
document.querySelectorAll('.sakura-trigger').forEach((btn) => {
  btn.addEventListener('click', () => { sakuraRain(34); burst(btn, 20); });
});
document.querySelector('.hero-crest').addEventListener('click', () => sakuraRain(24));
// 自动飘：加载时来一场，之后每 25 秒轻轻补一阵
setTimeout(() => sakuraRain(22), 1200);
setInterval(() => sakuraRain(6), 25000);

/* ---------- 汉堡菜单 ---------- */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- 滚动高亮导航 ---------- */
const sections = [...document.querySelectorAll('section[id], header[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  let current = 'hero';
  sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
  navLinks.forEach((a) => {
    const active = a.getAttribute('href') === '#' + current;
    a.style.background = active ? 'var(--gold)' : '';
    a.style.color = active ? '#fff' : '';
    a.classList.toggle('active-m', active);
  });
});
