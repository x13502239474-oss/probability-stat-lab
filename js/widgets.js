/* ================= 图表与交互模拟器 ================= */
(function(){
  'use strict';
  const C = {
    navy:'#123a5c', navy2:'#1b4f78', teal:'#0f9e8e', tealL:'rgba(15,158,142,.75)',
    gold:'#c9a227', red:'#c0392b', grid:'rgba(20,45,70,.08)', ink:'#425466'
  };
  const chartInstances = [];
  function baseOpts(){
    return {
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:C.ink,font:{size:12},usePointStyle:true,boxWidth:8}},
        tooltip:{backgroundColor:'#0a2038',padding:10,titleFont:{size:13},bodyFont:{size:12}}},
      scales:{
        x:{grid:{color:C.grid},ticks:{color:C.ink,font:{size:11}}},
        y:{grid:{color:C.grid},ticks:{color:C.ink,font:{size:11}},beginAtZero:true}
      },
      animation:{duration:500}
    };
  }
  function destroyAll(){ while(chartInstances.length){ try{chartInstances.pop().destroy();}catch(e){} } }

  // 正态分布密度函数
  function pdfNormal(x,mu,s){ return Math.exp(-0.5*Math.pow((x-mu)/s,2))/(s*Math.sqrt(2*Math.PI)); }
  // 二项分布
  function choose(n,k){ let r=1; for(let i=1;i<=k;i++) r=r*(n-i+1)/i; return r; }
  function pmfBinomial(k,n,p){ return choose(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k); }
  // 泊松
  function pmfPoisson(k,l){ let f=1; for(let i=1;i<=k;i++) f*=i; return Math.exp(-l)*Math.pow(l,k)/f; }
  // 指数
  function pdfExp(x,l){ return x<0?0:l*Math.exp(-l*x); }

  /* ---------- 静态图表 ---------- */
  function renderChart(canvas, cfg){
    const opts = baseOpts();
    let type = cfg.type;
    if(type==='normal'){
      const mu=cfg.mu??0, s=cfg.sigma??1;
      const xs=[],ys=[];
      for(let x=mu-4*s;x<=mu+4*s;x+=0.1*s){ xs.push(x.toFixed(2)); ys.push(pdfNormal(x,mu,s)); }
      opts.scales.y.title={display:true,text:'概率密度',color:C.ink};
      opts.scales.x.title={display:true,text:'x',color:C.ink};
      let ds=[{label:`N(${mu}, ${s}²)`,data:ys,borderColor:C.teal,backgroundColor:C.tealL,fill:true,tension:.4,pointRadius:0,borderWidth:2.5}];
      // 阴影区间
      if(cfg.shade && cfg.shade.length===2){
        const a=cfg.shade[0],b=cfg.shade[1];
        const shadeData=xs.map((x,i)=> (parseFloat(x)>=a&&parseFloat(x)<=b)?ys[i]:null);
        ds.push({label:`区间 [${a}, ${b}]`,data:shadeData,borderColor:C.gold,backgroundColor:'rgba(201,162,39,.35)',fill:true,pointRadius:0,borderWidth:1.5,tension:.4});
      }
      const ch=new Chart(canvas,{type:'line',data:{labels:xs,datasets:ds},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='binomial'){
      const n=cfg.n??10,p=cfg.p??0.5; const labels=[],data=[];
      for(let k=0;k<=n;k++){ labels.push(k); data.push(pmfBinomial(k,n,p)); }
      opts.scales.y.title={display:true,text:'概率',color:C.ink};
      const ch=new Chart(canvas,{type:'bar',data:{labels,datasets:[{label:`Bin(${n}, ${p})`,data,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5,borderRadius:3}]},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='poisson'){
      const l=cfg.lambda??3; const labels=[],data=[];
      for(let k=0;k<=Math.max(10,l+4*Math.sqrt(l));k++){ labels.push(k); data.push(pmfPoisson(k,l)); }
      const ch=new Chart(canvas,{type:'bar',data:{labels,datasets:[{label:`Poisson(${l})`,data,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5,borderRadius:3}]},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='exponential'){
      const l=cfg.lambda??1; const labels=[],data=[];
      for(let x=0;x<=8/l;x+=0.1){ labels.push(x.toFixed(1)); data.push(pdfExp(x,l)); }
      const ch=new Chart(canvas,{type:'line',data:{labels,datasets:[{label:`Exp(${l})`,data,borderColor:C.teal,backgroundColor:C.tealL,fill:true,tension:.3,pointRadius:0,borderWidth:2.5}]},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='histogram'){
      const vals=cfg.values||[]; const bins=cfg.bins||10;
      const min=Math.min.apply(null,vals),max=Math.max.apply(null,vals);
      const w=(max-min)/bins||1; const counts=new Array(bins).fill(0); const labels=[];
      vals.forEach(v=>{let i=Math.floor((v-min)/w); if(i>=bins)i=bins-1; counts[i]++;});
      for(let i=0;i<bins;i++) labels.push((min+i*w).toFixed(1));
      opts.scales.x.offset=true;
      const ch=new Chart(canvas,{type:'bar',data:{labels,datasets:[{label:'频数',data:counts,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5}]},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='scatter'){
      const pts=cfg.points||[]; const ds=[];
      if(cfg.regression && pts.length>1){
        let sx=0,sy=0,sxx=0,sxy=0,n=pts.length;
        pts.forEach(p=>{sx+=p[0];sy+=p[1];sxx+=p[0]*p[0];sxy+=p[0]*p[1];});
        const b=(n*sxy-sx*sy)/(n*sxx-sx*sx),a=(sy-b*sx)/n;
        const xmin=Math.min.apply(null,pts.map(p=>p[0])),xmax=Math.max.apply(null,pts.map(p=>p[0]));
        ds.push({type:'line',label:'回归线',data:[{x:xmin,y:a+b*xmin},{x:xmax,y:a+b*xmax}],borderColor:C.red,borderWidth:2,fill:false,pointRadius:0});
      }
      ds.unshift({type:'scatter',label:cfg.label||'数据点',data:pts.map(p=>({x:p[0],y:p[1]})),backgroundColor:C.teal,borderColor:C.teal,pointRadius:4});
      opts.scales.x.type='linear';
      const ch=new Chart(canvas,{type:'scatter',data:{datasets:ds},options:opts});
      chartInstances.push(ch); return;
    }
    if(type==='flow'){
      // 流程条：用横向条形模拟阶段
      const labels=cfg.labels||[],data=cfg.data||labels.map(()=>1);
      opts.indexAxis='y'; opts.plugins.legend.display=false;
      opts.scales.x={display:false};
      const ch=new Chart(canvas,{type:'bar',data:{labels,datasets:[{data,backgroundColor:[C.navy,C.navy2,C.teal,'#17b0a0',C.gold,'#d4b13a'],borderRadius:6,barThickness:26}]},options:opts});
      chartInstances.push(ch); return;
    }
    // 默认 bar / line / pie
    if(type==='pie'){
      const ch=new Chart(canvas,{type:'pie',data:{labels:cfg.labels||[],datasets:[{data:cfg.data||[],backgroundColor:[C.teal,C.navy2,C.gold,C.red,'#7e57c2','#26a69a']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:C.ink}}}}});
      chartInstances.push(ch); return;
    }
    const ch=new Chart(canvas,{type:type||'bar',data:{labels:cfg.labels||[],datasets:[{label:cfg.label||'数值',data:cfg.data||[],backgroundColor:cfg.color||C.tealL,borderColor:cfg.color||C.teal,borderWidth:1.5,borderRadius:3,tension:.3}]},options:opts});
    chartInstances.push(ch);
  }

  /* ---------- 交互模拟器 ---------- */
  let simSeq=0;
  function makeSim(container, cfg){
    const type=cfg.type;
    const id='sim'+(++simSeq);
    if(type==='coin') return simCoin(container,id);
    if(type==='dice') return simDice(container,id);
    if(type==='clt') return simCLT(container,id);
    if(type==='normal') return simNormal(container,id,cfg);
    if(type==='binomial') return simBinomial(container,id,cfg);
    if(type==='poisson') return simPoisson(container,id,cfg);
    if(type==='ci') return simCI(container,id);
    if(type==='bayes') return simBayes(container,id);
    if(type==='sampling') return simSampling(container,id);
    if(type==='regression') return simRegression(container,id);
    if(type==='montyhall') return simMonty(container,id);
    if(type==='uniform') return simUniform(container,id,cfg);
    container.innerHTML='<div class="sim-note">该模拟器即将上线。</div>';
  }

  function ctrl(label,min,max,val,step){ step=step||1; return `<div class="sim-control"><label>${label}</label><input type="range" min="${min}" max="${max}" value="${val}" step="${step}"><span class="val">${val}</span></div>`; }
  function bindSlider(box,fn){
    box.querySelectorAll('input[type=range]').forEach(inp=>{
      const out=inp.parentElement.querySelector('.val');
      inp.addEventListener('input',()=>{ out.textContent=inp.value; fn(); });
    });
  }

  // 抛硬币
  function simCoin(box,id){
    let heads=0,tails=0,trials=0,ratios=[];
    box.innerHTML=`<div class="sim-box">
      <div class="sim-controls">
        <button class="sim-btn act" data-a="one">抛 1 次</button>
        <button class="sim-btn" data-a="hundred">抛 100 次</button>
        <button class="sim-btn" data-a="thousand">抛 1000 次</button>
        <button class="sim-btn" data-a="reset" style="background:#8a97a4">重置</button>
      </div>
      <div class="sim-stat">
        <div class="st"><div class="n" id="${id}-h">0</div><div class="l">正面</div></div>
        <div class="st"><div class="n" id="${id}-t">0</div><div class="l">反面</div></div>
        <div class="st"><div class="n" id="${id}-r">—</div><div class="l">正面频率</div></div>
      </div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">观察：抛的次数越多，正面频率越接近 0.5。这就是「大数定律」的直观表现（第 7.6 节）。</div>
    </div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d');
    let ch=null;
    function upd(){
      box.querySelector('#'+id+'-h').textContent=heads;
      box.querySelector('#'+id+'-t').textContent=tails;
      box.querySelector('#'+id+'-r').textContent=trials? (heads/trials).toFixed(3):'—';
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'line',data:{labels:ratios.map((_,i)=>i+1),datasets:[{label:'正面频率',data:ratios,borderColor:C.teal,pointRadius:0,tension:.1,borderWidth:2}]},
        options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{y:{min:0,max:1,grid:{color:C.grid}},x:{grid:{color:C.grid},title:{display:true,text:'抛掷次数',color:C.ink}}},plugins:{legend:{display:false}}}});
      chartInstances.push(ch);
    }
    function toss(n){ for(let i=0;i<n;i++){ if(Math.random()<0.5)heads++;else tails++; trials++; ratios.push(heads/trials);} upd(); }
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.a;
      if(a==='one')toss(1); else if(a==='hundred')toss(100); else if(a==='thousand')toss(1000);
      else{heads=tails=trials=0;ratios=[];upd();}
    }));
    upd();
  }

  // 掷骰子
  function simDice(box,id){
    let counts=[0,0,0,0,0,0],trials=0;
    box.innerHTML=`<div class="sim-box">
      <div class="sim-controls">
        <button class="sim-btn act" data-a="1">掷 1 次</button>
        <button class="sim-btn" data-a="100">掷 100 次</button>
        <button class="sim-btn" data-a="1000">掷 1000 次</button>
        <button class="sim-btn" data-a="reset" style="background:#8a97a4">重置</button>
      </div>
      <div class="sim-stat"><div class="st"><div class="n" id="${id}-n">0</div><div class="l">总次数</div></div><div class="st"><div class="n" id="${id}-f">—</div><div class="l">各面频率是否接近 1/6≈0.167</div></div></div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">均匀骰子每个面的真实概率都是 1/6。掷得越多，柱形越趋于一样高。</div>
    </div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function upd(){
      box.querySelector('#'+id+'-n').textContent=trials;
      const freqs=counts.map(c=>trials?(c/trials).toFixed(3):'0');
      box.querySelector('#'+id+'-f').textContent=freqs.join(' / ');
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels:['1','2','3','4','5','6'],datasets:[{label:'频数',data:counts,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}});
      chartInstances.push(ch);
    }
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.a;
      if(a==='reset'){counts=[0,0,0,0,0,0];trials=0;}
      else{const n=+a;for(let i=0;i<n;i++){counts[Math.floor(Math.random()*6)]++;trials++;}}
      upd();
    }));
    upd();
  }

  // 正态滑块
  function simNormal(box,id,cfg){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('均值 μ',-5,5,cfg.mu??0,0.5)}${ctrl('标准差 σ',0.5,4,cfg.sigma??1,0.1)}</div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">拖动 μ 看钟形曲线左右移动；拖动 σ 看曲线变胖变瘦。曲线下方总面积恒为 1。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const mu=+box.querySelectorAll('input[type=range]')[0].value, s=+box.querySelectorAll('input[type=range]')[1].value;
      const xs=[],ys=[]; for(let x=mu-4*s;x<=mu+4*s;x+=0.08*s){xs.push(x.toFixed(2));ys.push(pdfNormal(x,mu,s));}
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'line',data:{labels:xs,datasets:[{label:`N(${mu}, ${s}²)`,data:ys,borderColor:C.teal,backgroundColor:C.tealL,fill:true,tension:.4,pointRadius:0,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:{color:C.grid}},y:{grid:{color:C.grid}}},plugins:{legend:{labels:{color:C.ink}}},animation:{duration:200}}});
      chartInstances.push(ch);
    }
    bindSlider(box,draw); draw();
  }

  // 二项滑块
  function simBinomial(box,id,cfg){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('试验次数 n',1,30,cfg.n??10,1)}${ctrl('成功概率 p',0,1,cfg.p??0.5,0.05)}</div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">n 次独立试验中恰好成功 k 次的概率。p=0.5 时分布对称，p 偏离 0.5 时出现偏态。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const n=+box.querySelectorAll('input[type=range]')[0].value,p=+box.querySelectorAll('input[type=range]')[1].value;
      const labels=[],data=[]; for(let k=0;k<=n;k++){labels.push(k);data.push(pmfBinomial(k,n,p));}
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'概率',data,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false}}},plugins:{legend:{display:false}},animation:{duration:200}}});
      chartInstances.push(ch);
    }
    bindSlider(box,draw); draw();
  }

  // 泊松滑块
  function simPoisson(box,id,cfg){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">${ctrl('平均值 λ',0.5,15,cfg.lambda??3,0.5)}</div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">泊松分布描述单位时间/空间内随机事件发生次数。λ 既是均值也是方差。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const l=+box.querySelector('input[type=range]').value; const labels=[],data=[];
      for(let k=0;k<=Math.max(12,l+4*Math.sqrt(l));k++){labels.push(k);data.push(pmfPoisson(k,l));}
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'概率',data,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1.5,borderRadius:3}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false}}},plugins:{legend:{display:false}},animation:{duration:200}}});
      chartInstances.push(ch);
    }
    bindSlider(box,draw); draw();
  }

  // 均匀分布模拟
  function simUniform(box,id,cfg){
    const a=cfg.a??0,b=cfg.b??1;
    box.innerHTML=`<div class="sim-box"><div class="sim-controls"><button class="sim-btn act" data-a="draw">生成 1000 个随机数</button></div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">区间 [${a}, ${b}] 上每个值出现的可能性相同。直方图应大致平坦。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const vals=[];for(let i=0;i<1000;i++)vals.push(a+Math.random()*(b-a));
      const bins=12,w=(b-a)/bins,cnt=new Array(bins).fill(0),labels=[];
      vals.forEach(v=>{let i=Math.floor((v-a)/w);if(i>=bins)i=bins-1;cnt[i]++;});
      for(let i=0;i<bins;i++)labels.push((a+i*w).toFixed(2));
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'频数',data:cnt,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}});
      chartInstances.push(ch);
    }
    box.querySelector('button').addEventListener('click',draw); draw();
  }

  // 中心极限定理
  function simCLT(box,id){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('每次样本量 n',1,40,5,1)}${ctrl('抽样次数',100,3000,800,100)}</div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">从一个明显不服从正态的总体（指数分布）中抽样。看样本均值的分布：不管 n 多小，均值分布都近似正态——而且 n 越大越像。这就是中心极限定理（第 7.7 节）。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const n=+box.querySelectorAll('input[type=range]')[0].value, reps=+box.querySelectorAll('input[type=range]')[1].value;
      const means=[]; for(let r=0;r<reps;r++){let s=0;for(let i=0;i<n;i++)s+=-Math.log(1-Math.random());means.push(s/n);}
      const min=Math.min.apply(null,means),max=Math.max.apply(null,means),bins=24,w=(max-min)/bins,cnt=new Array(bins).fill(0),labels=[];
      means.forEach(v=>{let i=Math.floor((v-min)/w);if(i>=bins)i=bins-1;cnt[i]++;});
      for(let i=0;i<bins;i++)labels.push((min+i*w).toFixed(2));
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'样本均值的频数',data:cnt,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false}}},plugins:{legend:{display:false}},animation:{duration:200}}});
      chartInstances.push(ch);
    }
    bindSlider(box,draw); draw();
  }

  // 置信区间覆盖
  function simCI(box,id){
    let covered=0,total=0;
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('置信水平',80,99,95,1)}<button class="sim-btn act" data-a="run">模拟 100 次</button><button class="sim-btn" data-a="reset" style="background:#8a97a4">重置</button></div>
      <div class="sim-stat"><div class="st"><div class="n" id="${id}-c">0%</div><div class="l">覆盖比例</div></div><div class="st"><div class="n" id="${id}-t">0</div><div class="l">累计实验次数</div></div></div>
      <div class="sim-canvas"><canvas id="${id}-chart"></canvas></div>
      <div class="sim-note">真实均值 μ=50，标准差 σ=10。每次抽 n=30 的样本并算 95% 置信区间。看有多少条区间「抓住」了真实的 50——理论上应约等于所选置信水平。这就是置信水平的含义（第 8.5 节）。</div></div>`;
    const ctx=box.querySelector('#'+id+'-chart').getContext('2d'); let ch=null; const history=[];
    function upd(){
      box.querySelector('#'+id+'-c').textContent=total?(covered/total*100).toFixed(1)+'%':'—';
      box.querySelector('#'+id+'-t').textContent=total;
      const show=history.slice(-30);
      if(ch)ch.destroy();
      const datasets=[
        {label:'本次置信区间',data:show.map(h=>[h.lo,h.hi]),backgroundColor:show.map(h=>h.hit?C.tealL:'rgba(192,57,43,.4)'),borderColor:show.map(h=>h.hit?C.teal:C.red),borderWidth:1},
        {label:'真实 μ=50',data:show.map(()=>[50,50]),borderColor:C.gold,borderWidth:2,pointRadius:0}
      ];
      ch=new Chart(ctx,{type:'bar',data:{labels:show.map((_,i)=>''+(total-show.length+i+1)),datasets},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',scales:{x:{grid:{color:C.grid},min:40,max:60},y:{grid:{display:false}}},plugins:{legend:{labels:{color:C.ink}}},animation:false}});
      chartInstances.push(ch);
    }
    function run(){
      const conf=+box.querySelector('input[type=range]').value;
      const z=conf===95?1.96:conf===90?1.645:conf===99?2.576:conf===80?1.28:1.96;
      const n=30;
      for(let r=0;r<100;r++){
        let s=0;for(let i=0;i<n;i++){let u1=Math.random(),u2=Math.random();s+=50+10*Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);}
        const m=s/n, moe=z*10/Math.sqrt(n),lo=m-moe,hi=m+moe,hit=(lo<=50&&hi>=50);
        if(hit)covered++;total++;history.push({lo,hi,hit});
      }
      upd();
    }
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.a==='run')run();else{covered=total=0;history.length=0;upd();}}));
    upd();
  }

  // 贝叶斯更新
  function simBayes(box,id){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('先验患病率',1,50,1,1)}${ctrl('检测灵敏度',50,99,99,1)}${ctrl('特异度',50,99,99,1)}</div>
      <div class="sim-stat"><div class="st"><div class="n" id="${id}-post">—</div><div class="l">检测为阳性后真的患病的概率</div></div></div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">经典的「假阳性悖论」：即使检测准确率高达 99%，当疾病很罕见时，阳性结果真的患病的概率可能低得惊人。调低先验患病率试试看。这就是贝叶斯定理（第 3.10 节）。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const sl=box.querySelectorAll('input[type=range]');
      const prior=+sl[0].value/100, sens=+sl[1].value/100, spec=+sl[2].value/100;
      const pD=prior*sens, pN=(1-prior)*(1-spec);
      const post=pD/(pD+pN);
      box.querySelector('#'+id+'-post').textContent=(post*100).toFixed(1)+'%';
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels:['真阳性','假阳性'],datasets:[{label:'人数占比',data:[pD*1000,pN*1000],backgroundColor:[C.teal,'rgba(192,57,43,.65)'],borderColor:[C.teal,C.red],borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid},title:{display:true,text:'每 1000 人中',color:C.ink}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}});
      chartInstances.push(ch);
    }
    bindSlider(box,draw); draw();
  }

  // 抽样实验
  function simSampling(box,id){
    const pop=[];for(let i=0;i<1000;i++)pop.push(Math.random()<0.4?1:0); // 总体中40%是"是"
    const trueP=pop.reduce((a,b)=>a+b,0)/pop.length;
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('样本量 n',10,300,50,10)}<button class="sim-btn act" data-a="draw">抽一个样本</button></div>
      <div class="sim-stat"><div class="st"><div class="n" id="${id}-true">${(trueP*100).toFixed(1)}%</div><div class="l">总体真实比例</div></div><div class="st"><div class="n" id="${id}-samp">—</div><div class="l">样本比例</div></div></div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">反复抽样，样本比例会在总体真实比例附近波动。样本量越大，波动越小——这就是抽样误差与标准误差的直觉（第 7.3、7.8 节）。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); const hist=new Array(20).fill(0); let ch=null;
    function draw(){
      const n=+box.querySelector('input[type=range]').value;
      let s=0;for(let i=0;i<n;i++)s+=pop[Math.floor(Math.random()*pop.length)];
      const ph=s/n; box.querySelector('#'+id+'-samp').textContent=(ph*100).toFixed(1)+'%';
      let bi=Math.floor(ph*20);if(bi>=20)bi=19;hist[bi]++;
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'bar',data:{labels:hist.map((_,i)=>(i/20).toFixed(2)),datasets:[{label:'出现次数',data:hist,backgroundColor:C.tealL,borderColor:C.teal,borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,grid:{color:C.grid}},x:{grid:{display:false},title:{display:true,text:'样本比例',color:C.ink}}},plugins:{legend:{display:false}}}});
      chartInstances.push(ch);
    }
    box.querySelector('button').addEventListener('click',draw); draw();
  }

  // 回归拟合
  function simRegression(box,id){
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      ${ctrl('数据点个数',10,80,30,5)}${ctrl('噪声大小',0.5,8,3,0.5)}<button class="sim-btn act" data-a="gen">重新生成</button></div>
      <div class="sim-canvas"><canvas id="${id}-c"></canvas></div>
      <div class="sim-note">真实关系是 y = 2x + 5。红的颜色是最小二乘拟合线。噪声越大，拟合越不确定——但点越多，拟合越稳（第 10.4—10.5 节）。</div></div>`;
    const ctx=box.querySelector('#'+id+'-c').getContext('2d'); let ch=null;
    function draw(){
      const n=+box.querySelectorAll('input[type=range]')[0].value,noise=+box.querySelectorAll('input[type=range]')[1].value;
      const pts=[];for(let i=0;i<n;i++){const x=Math.random()*10;const y=2*x+5+(Math.random()-0.5)*2*noise;pts.push([x,y]);}
      let sx=0,sy=0,sxx=0,sxy=0;pts.forEach(p=>{sx+=p[0];sy+=p[1];sxx+=p[0]*p[0];sxy+=p[0]*p[1];});
      const b=(n*sxy-sx*sy)/(n*sxx-sx*sx),a=(sy-b*sx)/n;
      if(ch)ch.destroy();
      ch=new Chart(ctx,{type:'scatter',data:{datasets:[
        {type:'scatter',label:'数据点',data:pts.map(p=>({x:p[0],y:p[1]})),backgroundColor:C.tealL,borderColor:C.teal,pointRadius:3.5},
        {type:'line',label:`拟合线 y=${b.toFixed(2)}x+${a.toFixed(2)}`,data:[{x:0,y:a},{x:10,y:a+b*10}],borderColor:C.red,borderWidth:2,pointRadius:0,fill:false}
      ]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{type:'linear',grid:{color:C.grid}},y:{grid:{color:C.grid}}},plugins:{legend:{labels:{color:C.ink}}},animation:{duration:200}}});
      chartInstances.push(ch);
    }
    box.querySelectorAll('input[type=range]').forEach(i=>i.addEventListener('input',()=>{i.parentElement.querySelector('.val').textContent=i.value;draw();}));
    box.querySelector('button').addEventListener('click',draw); draw();
  }

  // 蒙提霍尔
  function simMonty(box,id){
    let stayWin=0,stayN=0,switchWin=0,switchN=0;
    box.innerHTML=`<div class="sim-box"><div class="sim-controls">
      <button class="sim-btn" data-a="stay">坚持不换 ×100</button><button class="sim-btn act" data-a="switch">选择换门 ×100</button>
      <button class="sim-btn" data-a="reset" style="background:#8a97a4">重置</button></div>
      <div class="sim-stat">
        <div class="st"><div class="n" id="${id}-s">—</div><div class="l">不换的中奖率(应≈1/3)</div></div>
        <div class="st"><div class="n" id="${id}-w">—</div><div class="l">换门的中奖率(应≈2/3)</div></div></div>
      <div class="sim-note">三扇门一扇有车。你先选一扇，主持人打开一扇有羊的门后，问你换不换。模拟告诉你：换门胜率几乎是不换的两倍。这是条件概率的经典反直觉案例（第 3.7 节）。</div></div>`;
    function play(sw){
      const car=Math.floor(Math.random()*3);let pick=Math.floor(Math.random()*3);
      // 主持人打开一个既不是车也不是所选的门
      let open;for(let i=0;i<3;i++){if(i!==car&&i!==pick){open=i;break;}if(i!==car&&i!==pick)open=i;}
      if(pick!==car&&open===undefined){}
      // 若选的就是车，主持人随机开一扇羊门
      if(pick===car){const goats=[0,1,2].filter(i=>i!==car);open=goats[Math.floor(Math.random()*2)];}
      else{open=[0,1,2].filter(i=>i!==car&&i!==pick)[0];}
      let final=pick;
      if(sw){final=[0,1,2].filter(i=>i!==pick&&i!==open)[0];}
      return final===car;
    }
    function upd(){
      box.querySelector('#'+id+'-s').textContent=stayN?(stayWin/stayN*100).toFixed(1)+'%':'—';
      box.querySelector('#'+id+'-w').textContent=switchN?(switchWin/switchN*100).toFixed(1)+'%':'—';
    }
    box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.a;
      if(a==='reset'){stayWin=stayN=switchWin=switchN=0;}
      else if(a==='stay'){for(let i=0;i<100;i++){stayN++;if(play(false))stayWin++;}}
      else{for(let i=0;i<100;i++){switchN++;if(play(true))switchWin++;}}
      upd();
    }));
    upd();
  }

  window.Widgets={ renderChart, makeSim, destroyAll, pdfNormal, pmfBinomial, pmfPoisson };
})();
