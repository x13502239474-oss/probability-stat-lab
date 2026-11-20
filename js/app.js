/* ================= 应用主逻辑 ================= */
(function(){
  'use strict';
  const D = window.COURSE_DATA;
  const wrap = document.getElementById('contentWrap');
  const navList = document.getElementById('navList');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('drawerOverlay');
  const searchPanel = document.getElementById('searchPanel');
  const partIcons = {
    compass:'<path fill="currentColor" d="M12 2 2 12l10 10 10-10L12 2Zm0 4.3 3.7 3.7-3.7 3.7-3.7-3.7L12 6.3Z"/>',
    chart:'<path fill="currentColor" d="M4 20h16v2H2V4h2v16Zm3-3h3V9H7v8Zm5 0h3V5h-3v12Zm5 0h3v-6h-3v6Z"/>',
    dice:'<path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM7.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0 9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.5-4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>',
    function:'<path fill="currentColor" d="M16.5 3c-2.2 0-3.6 1-4.5 2.8C11.1 7.6 10.4 9 9 9H6.5v2H9c.5 0 1 .1 1.4.3-.1.6-.3 1.2-.6 1.8C8.9 14.6 7.8 16 6.5 16H5v2h1.5c2.2 0 3.8-1 4.7-2.8.7-1.4 1.4-2.8 2.6-2.8h.7V11h-.7c-.5 0-1-.1-1.4-.3.1-.5.3-1 .6-1.6C14.1 7.4 15.2 6 16.5 6H18V3h-1.5Z"/>',
    bell:'<path fill="currentColor" d="M5 16h14l-2-3v-4a5 5 0 0 0-4-4.9V3h-2v1.1A5 5 0 0 0 7 9v4l-2 3Zm7 3a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"/>',
    grid:'<path fill="currentColor" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"/>',
    layers:'<path fill="currentColor" d="m12 2 9 5-9 5-9-5 9-5Zm0 7.5 6.5-3.6L12 2.4 5.5 5.9 12 9.5ZM3 12l9 5 9-5-1.8-1-7.2 4-7.2-4L3 12Zm0 4.5 9 5 9-5-1.8-1-7.2 4-7.2-4-1.8 1Z"/>',
    target:'<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>',
    clipboard:'<path fill="currentColor" d="M17 2h-3a3 3 0 0 0-4 0H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 18H7V4h2v2h6V4h2v16Z"/>',
    trend:'<path fill="currentColor" d="m3 17 6-6 4 4 8-8v4h2V5h-6v2h3.2l-7.2 7.2-4-4L4 18.4 3 17Z"/>',
    update:'<path fill="currentColor" d="M12 4V1L8 5l4 4V6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8Z"/>',
    atom:'<path fill="currentColor" d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-1.5-4.3c-2.4-1-4.4-.8-5.2.6-1 1.7.2 3.9 2.6 5.3 1.4.8 3 1.3 4.3 1.5-.4-1.5-1.2-3.2-2.2-4.5-.6-.8-1.2-1.6-1.9-2.2l2.4-1.7Zm3 0c2.4-1 4.4-.8 5.2.6 1 1.7-.2 3.9-2.6 5.3-1.4.8-3 1.3-4.3 1.5.4-1.5 1.2-3.2 2.2-4.5.6-.8 1.2-1.6 1.9-2.2l-2.4-1.7Zm-3 12.6c2.4 1 4.4.8 5.2-.6 1-1.7-.2-3.9-2.6-5.3-1.4-.8-3-1.3-4.3-1.5.4 1.5 1.2 3.2 2.2 4.5.6.8 1.2 1.6 1.9 2.2l-2.4 1.7Zm-3 0c-2.4 1-4.4.8-5.2-.6-1-1.7.2-3.9 2.6-5.3 1.4-.8 3-1.3 4.3-1.5-.4 1.5-1.2 3.2-2.2 4.5-.6.8-1.2 1.6-1.9 2.2l2.4 1.7Z"/>',
    code:'<path fill="currentColor" d="m9.4 16.6-5.4-4.6 5.4-4.6L8 6l-7 6 7 6 1.4-1.4Zm5.2 0L20 12l-5.4-4.6L16 6l7 6-7 6-1.4-1.4Z"/>',
    case:'<path fill="currentColor" d="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Zm-8 0h-4V4h4v2Zm8 14H4V8h16v12Z"/>'
  };

  // 工具：转义 HTML
  function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
  function readyCount(){ let n=0; D.parts.forEach(p=>p.chapters.forEach(c=>{if(c.ready)n++;})); return n; }
  function totalCount(){ let n=0; D.parts.forEach(p=>n+=p.chapters.length); return n; }
  function findChapter(id){ for(const p of D.parts){ const i=p.chapters.findIndex(c=>c.id===id); if(i>=0)return{part:p,ch:p.chapters[i],idx:i}; } return null; }

  /* ---------- 目录渲染 ---------- */
  function buildNav(activeId){
    navList.innerHTML='';
    D.parts.forEach((p,pi)=>{
      const ready=p.chapters.filter(c=>c.ready).length;
      const part=document.createElement('div');
      part.className='nav-part'+(pi>2?' collapsed':'');
      const head=document.createElement('div');
      head.className='nav-part-head';
      head.innerHTML=`<span class="pnum">${String(pi+1).padStart(2,'0')}</span><span class="ptitle">${esc(p.title)}</span><span class="chev">▸</span>`;
      head.addEventListener('click',()=>part.classList.toggle('collapsed'));
      part.appendChild(head);
      const list=document.createElement('div');
      list.className='nav-chapters';
      p.chapters.forEach((c,ci)=>{
        const a=document.createElement('div');
        a.className='nav-chapter'+(c.id===activeId?' active':'')+(c.ready?'':' pending');
        a.innerHTML=`<span class="cnum">${c.id}</span><span class="ctitle">${esc(c.title)}</span>`+(c.ready?'':'<span class="soon">待编写</span>');
        if(c.ready) a.addEventListener('click',()=>{ location.hash='#/ch/'+c.id; closeDrawer(); });
        list.appendChild(a);
      });
      part.appendChild(list);
      navList.appendChild(part);
    });
    if(activeId){
      // 展开包含当前章节的部分并滚动到可见
      const f=findChapter(activeId);
      if(f){
        const parts=navList.querySelectorAll('.nav-part');
        const idx=D.parts.indexOf(f.part);
        if(parts[idx]) parts[idx].classList.remove('collapsed');
        const activeEl=navList.querySelector('.nav-chapter.active');
        if(activeEl) setTimeout(()=>activeEl.scrollIntoView({block:'center'}),50);
      }
    }
  }

  /* ---------- 首页渲染 ---------- */
  function renderHome(){
    destroyViz();
    const rc=readyCount(),tc=totalCount();
    let partsHTML='';
    D.parts.forEach(p=>{
      const r=p.chapters.filter(c=>c.ready).length;
      const ready=r===p.chapters.length;
      const target = r>0 ? p.chapters.find(c=>c.ready).id : null;
      partsHTML+=`<a class="part-card" href="${target?'#/ch/'+target:'#/part/'+p.id}">
        <div class="part-card-top">
          <div class="part-icon"><svg viewBox="0 0 24 24">${partIcons[p.icon]||partIcons.chart}</svg></div>
          <div><div class="pnum">${esc(p.num)}</div><h3>${esc(p.title)}</h3></div>
        </div>
        <div class="pdesc">${esc(p.desc)}</div>
        <div class="pmeta">
          <span>${p.chapters.length} 章</span>
          <span class="${ready?'badge-ready':'badge-pending'}">${ready?'已完整':(r>0?`已写 ${r}/${p.chapters.length}`:'待编写')}</span>
          <span style="margin-left:auto;color:var(--teal-600)">${target?'进入 →':''}</span>
        </div>
      </a>`;
    });
    wrap.innerHTML=`
      <section class="hero">
        <div class="hero-inner">
          <span class="hero-kicker">STATISTICS × PROBABILITY · 系统课程</span>
          <h1>让数据说话，<br>让<em>不确定</em>变得可理解</h1>
          <p class="hero-desc">一套为零基础学习者打造的概率论与数理统计自学课程。融合三本经典教材，从统计直觉出发，一步步走到概率推导、统计推断与 Python 实践。每个概念都解释，每个公式都推导。</p>
          <div class="hero-stats">
            <div class="hero-stat"><div class="n">${D.parts.length}<small>部分</small></div><div class="l">完整知识体系</div></div>
            <div class="hero-stat"><div class="n">${tc}<small>章</small></div><div class="l">系统化知识点</div></div>
            <div class="hero-stat"><div class="n">3<small>本</small></div><div class="l">经典教材融合</div></div>
            <div class="hero-stat"><div class="n">${rc}<small>章</small></div><div class="l">已编写教材级内容</div></div>
          </div>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#/ch/1-1">开始学习 →</a>
            <a class="btn btn-ghost" href="#/roadmap">查看知识体系</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>三本教材，一套体系</h2><span class="en">Three Books, One Journey</span></div>
        <p class="section-desc">我们不按书分块，而是把三本书的内容按知识点融合成一条连贯的学习路径。同一概念取各家所长，互相补充。</p>
        <div class="book-row">
          <div class="book-card"><div class="book-tag">直觉 · 案例</div><h3>赤裸裸的统计学</h3><p>Charles Wheelan。负责入门、统计思维与现实案例——为什么买彩票是智商税、黑天鹅如何击垮华尔街。让抽象概念先变得可感。</p></div>
          <div class="book-card"><div class="book-tag">系统 · 主干</div><h3>OpenIntro Statistics</h3><p>Diez / Çetinkaya-Rundel / Barr。核心教材，负责搭建完整的统计学知识体系：从数据到描述、概率、推断与回归。</p></div>
          <div class="book-card"><div class="book-tag">深度 · 推导</div><h3>Introduction to Probability</h3><p>Blitzstein & Hwang。负责概率论的深入与严格推导：计数、条件概率、期望、极限定理与随机过程。</p></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>完整课程体系</h2><span class="en">14 Parts</span></div>
        <p class="section-desc">从统计直觉到高级概率论，14 个部分层层递进。当前正在编写第 1—4 部分，其余章节将陆续完成——我们不会把没写的内容标成已完成。</p>
        <div class="part-grid">${partsHTML}</div>
      </section>

      <section class="section" id="roadmap">
        <div class="section-head"><h2>学习路径</h2><span class="en">Learning Roadmap</span></div>
        <p class="section-desc">这是一条"直觉 → 理论 → 应用"的螺旋上升路径。数学基础薄弱也没关系，每一步都会有人扶着你走。</p>
        <div class="flow-road">
          ${['统计直觉<br><span class="rd">第1-2部分</span>','概率基础<br><span class="rd">第3-6部分</span>','统计推断<br><span class="rd">第7-9部分</span>','进阶主题<br><span class="rd">第10-12部分</span>','计算与实践<br><span class="rd">第13-14部分</span>'].map((s,i,arr)=>`<div class="road-node"><div class="rn">0${i+1}</div><div class="rt">${s}</div></div>${i<arr.length-1?'<div class="road-arrow">›</div>':''}`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>为数学基础薄弱的你而设计</h2><span class="en">Built for Beginners</span></div>
        <div class="part-grid">
          <div class="book-card"><div class="book-tag">01</div><h3>零基础起步</h3><p>默认你没学过概率论。术语第一次出现就解释，公式逐个符号拆解，推导一步都不跳。</p></div>
          <div class="book-card"><div class="book-tag">02</div><h3>生活案例驱动</h3><p>抛硬币、奶茶店、蒙提霍尔、金融危机——抽象概念先落到你能想象的场景上。</p></div>
          <div class="book-card"><div class="book-tag">03</div><h3>边学边玩</h3><p>内置抛硬币、掷骰子、正态分布、中心极限定理等交互实验，拖一拖参数，概率变化看得见。</p></div>
          <div class="book-card"><div class="book-tag">04</div><h3>可阅读的教材</h3><p>每章含导入、概念、定义、推导、例题、可视化、Python、误区等完整环节，达到独立阅读的深度。</p></div>
        </div>
      </section>`;
    buildNav(null);
    document.getElementById('sidebarProgress').textContent=`共 ${D.parts.length} 部分 · ${tc} 章 · 已写 ${rc} 章`;
  }

  /* ---------- 章节页渲染 ---------- */
  let vizCharts=[];
  function destroyViz(){ if(window.Widgets) window.Widgets.destroyAll(); vizCharts=[]; }

  function renderChapter(id){
    const f=findChapter(id);
    if(!f){ renderHome(); return; }
    const {part,ch,idx}=f;
    buildNav(id);
    if(!ch.ready){
      wrap.innerHTML=`<div class="crumb"><a href="#/">首页</a> <span>›</span> ${esc(part.num)} <span>›</span> ${esc(ch.title)}</div>
        <div class="coming"><div class="icon">◌</div><h2>${esc(ch.title)}</h2>
        <p>这一章正在编写中。我们坚持每章都达到教材级深度，所以宁可慢一点，也不放半成品上来。你可以先学习其他已完成的章节。</p>
        <a class="btn btn-primary" href="#/">返回课程首页</a></div>`;
      return;
    }
    let md=D.chapters[id]||'';
    // 去掉 markdown 的一级标题（章节标题已在 chapter-head 显示）
    md=md.replace(/^\s*#\s+.*(\r?\n|$)/,'');
    // 用 marked 渲染 markdown
    let html;
    try{ html=marked.parse(md); }catch(e){ html='<p>内容渲染出错：'+esc(e.message)+'</p>'; }
    // 上一步导航
    let prev=null,next=null;
    if(idx>0 && part.chapters[idx-1].ready) prev=part.chapters[idx-1];
    if(idx<part.chapters.length-1 && part.chapters[idx+1].ready) next=part.chapters[idx+1];
    // 找同部分外的下一章（若本部分无下一章）
    if(!next){ const pi=D.parts.indexOf(part); for(let j=pi+1;j<D.parts.length && !next;j++){ const c=D.parts[j].chapters.find(c=>c.ready); if(c)next=c; } }
    if(!prev){ const pi=D.parts.indexOf(part); for(let j=pi-1;j>=0 && !prev;j--){ const cs=D.parts[j].chapters.filter(c=>c.ready); if(cs.length)prev=cs[cs.length-1]; } }

    wrap.innerHTML=`<div class="crumb"><a href="#/">首页</a> <span>›</span> <a href="#/part/${part.id}">${esc(part.num)} ${esc(part.title)}</a> <span>›</span> ${esc(ch.title)}</div>
      <div class="chapter-head"><div class="ch-label">${esc(part.num)} · 第 ${esc(ch.id)} 讲</div><h1>${esc(ch.title)}</h1></div>
      <article class="chapter-body" id="chapterBody">${html}</article>
      <div class="chapter-nav">
        ${prev?`<a href="#/ch/${prev.id}"><div class="cn-label">← 上一章</div><div class="cn-title">${esc(prev.title)}</div></a>`:'<a class="disabled"><div class="cn-label">← 上一章</div><div class="cn-title">已是开头</div></a>'}
        ${next?`<a class="next" href="#/ch/${next.id}"><div class="cn-label">下一章 →</div><div class="cn-title">${esc(next.title)}</div></a>`:'<a class="next disabled"><div class="cn-label">下一章 →</div><div class="cn-title">敬请期待</div></a>'}
      </div>`;

    // 渲染 LaTeX 公式（跳过代码块）
    try{
      renderMathInElement(document.getElementById('chapterBody'),{
        delimiters:[
          {left:'$$',right:'$$',display:true},
          {left:'$',right:'$',display:false}
        ],
        throwOnError:false, ignoredTags:['script','noscript','style','textarea','pre','code']
      });
    }catch(e){ console.warn('KaTeX渲染警告',e); }

    // 代码高亮
    document.querySelectorAll('#chapterBody pre code').forEach(el=>{ try{ hljs.highlightElement(el); }catch(e){} });

    // 图表 & 模拟器：把 ```chart / ```sim 代码块替换为组件
    const body=document.getElementById('chapterBody');
    body.querySelectorAll('pre code.language-chart, pre code.language-sim').forEach(code=>{
      const isSim=code.classList.contains('language-sim');
      let cfg;
      try{ cfg=JSON.parse(code.textContent.trim()); }
      catch(e){ console.warn('widget配置解析失败',code.textContent,e); return; }
      const pre=code.parentElement;
      const box=document.createElement('div');
      box.className='viz-block';
      if(isSim){
        box.innerHTML='<div class="viz-title">交互实验 · 动手试试</div>';
        const simHost=document.createElement('div'); box.appendChild(simHost);
        pre.replaceWith(box);
        try{ window.Widgets.makeSim(simHost,cfg); }catch(e){ console.warn('模拟器渲染失败',e); box.innerHTML+='<div class="sim-note">模拟器加载失败</div>'; }
      }else{
        const title=cfg.title||'数据可视化';
        box.innerHTML=`<div class="viz-title">${esc(title)}</div>`;
        const canvasWrap=document.createElement('div'); canvasWrap.className='chart-box';
        const canvas=document.createElement('canvas'); canvasWrap.appendChild(canvas);
        box.appendChild(canvasWrap);
        pre.replaceWith(box);
        try{ window.Widgets.renderChart(canvas,cfg); }catch(e){ console.warn('图表渲染失败',e); }
      }
    });

    window.scrollTo({top:0,behavior:'instant'});
  }

  /* ---------- 部分页渲染 ---------- */
  function renderPart(pid){
    const part=D.parts.find(p=>p.id===pid);
    if(!part){renderHome();return;}
    buildNav(null);
    let list='';
    part.chapters.forEach((c,i)=>{
      list+=`<a class="part-card" href="${c.ready?'#/ch/'+c.id:'#'}" style="cursor:${c.ready?'pointer':'default'}">
        <div class="part-card-top"><div class="part-icon" style="font-family:var(--mono);font-size:13px">${String(i+1).padStart(2,'0')}</div>
        <div><div class="pnum">${esc(c.id)}</div><h3>${esc(c.title)}</h3></div></div>
        <div class="pmeta">${c.ready?'<span class="badge-ready">已完成</span>':'<span class="badge-pending">待编写</span>'}<span style="margin-left:auto;color:var(--teal-600)">${c.ready?'阅读 →':''}</span></div>
      </a>`;
    });
    wrap.innerHTML=`<div class="crumb"><a href="#/">首页</a> <span>›</span> ${esc(part.num)}</div>
      <div class="chapter-head"><div class="ch-label">${esc(part.num)} · ${esc(part.source||'')}</div><h1>${esc(part.title)}</h1></div>
      <p class="section-desc" style="margin-top:16px">${esc(part.desc)}</p>
      <div class="part-grid" style="margin-top:24px">${list}</div>`;
  }

  /* ---------- 路由 ---------- */
  function route(){
    destroyViz();
    const h=location.hash||'#/';
    closeSearch();
    if(h.startsWith('#/ch/')) renderChapter(h.slice(5));
    else if(h.startsWith('#/part/')) renderPart(h.slice(7));
    else renderHome();
  }

  /* ---------- 抽屉 ---------- */
  function openDrawer(){ sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeDrawer(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  document.getElementById('menuBtn').addEventListener('click',openDrawer);
  overlay.addEventListener('click',closeDrawer);
  document.getElementById('brandHome').addEventListener('click',()=>{location.hash='#/';closeDrawer();});

  /* ---------- 搜索 ---------- */
  const searchInput=document.getElementById('searchInput');
  const searchResults=document.getElementById('searchResults');
  function openSearch(){ searchPanel.hidden=false; setTimeout(()=>searchInput.focus(),30); }
  function closeSearch(){ searchPanel.hidden=true; }
  document.getElementById('searchBtn').addEventListener('click',openSearch);
  document.getElementById('searchClose').addEventListener('click',closeSearch);
  searchPanel.addEventListener('click',e=>{if(e.target===searchPanel)closeSearch();});
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){closeSearch();closeDrawer();} if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();openSearch();} });

  function performSearch(q){
    q=q.trim();
    if(!q){ searchResults.innerHTML='<div class="sr-empty">输入关键词开始搜索，例如「贝叶斯」「标准差」</div>'; return; }
    const hits=[];
    D.parts.forEach(p=>p.chapters.forEach(c=>{
      if(!c.ready)return;
      const md=D.chapters[c.id]||'';
      const inTitle=c.title.includes(q);
      const idx=md.indexOf(q);
      if(inTitle||idx>=0){
        let snippet='';
        if(idx>=0){ const s=Math.max(0,idx-30); snippet=md.slice(s,s+110).replace(/[#*$$`]/g,'').replace(/\n/g,' '); }
        hits.push({part:p,ch:c,snippet,inTitle});
      }
    }));
    if(!hits.length){ searchResults.innerHTML=`<div class="sr-empty">没有找到与「${esc(q)}」相关的已完成章节</div>`; return; }
    const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g');
    searchResults.innerHTML=hits.map(h=>`<div class="sr-item" data-id="${h.ch.id}">
      <div class="sr-part">${esc(h.part.num)} · ${esc(h.part.title)} · ${esc(h.ch.id)}</div>
      <div class="sr-title">${esc(h.ch.title).replace(re,m=>'<mark>'+m+'</mark>')}</div>
      ${h.snippet?`<div class="sr-snippet">…${esc(h.snippet).replace(re,m=>'<mark>'+m+'</mark>')}…</div>`:''}
    </div>`).join('');
    searchResults.querySelectorAll('.sr-item').forEach(el=>el.addEventListener('click',()=>{location.hash='#/ch/'+el.dataset.id;closeSearch();}));
  }
  let searchTimer;
  searchInput.addEventListener('input',e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>performSearch(e.target.value),180);});

  // 侧栏筛选
  const navFilter=document.getElementById('navFilter');
  navFilter.addEventListener('input',e=>{
    const q=e.target.value.trim();
    const chapters=navList.querySelectorAll('.nav-chapter');
    chapters.forEach(a=>{
      const t=a.querySelector('.ctitle').textContent;
      a.style.display=(!q||t.includes(q))?'':'none';
    });
    navList.querySelectorAll('.nav-part').forEach(p=>{
      const vis=[...p.querySelectorAll('.nav-chapter')].some(a=>a.style.display!=='none');
      p.style.display=vis?'':'none';
      if(q)p.classList.remove('collapsed');
    });
  });

  window.addEventListener('hashchange',route);
  route();
})();
