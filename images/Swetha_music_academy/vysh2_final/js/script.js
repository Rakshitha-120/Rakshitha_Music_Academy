
function toggleMenu(){const n=document.getElementById('nav');if(n)n.classList.toggle('open')}
function toggleTheme(){document.body.classList.toggle('light')}
function playInstrument(name,btn){btn.textContent='♫ Playing';setTimeout(()=>btn.textContent='▶ Listen',1800)}
document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.reveal').forEach((e,i)=>{e.style.opacity='0';e.style.transform='translateY(18px)';setTimeout(()=>{e.style.transition='all .7s ease';e.style.opacity='1';e.style.transform='none'},120+i*100)}))

let audioCtx;
let activeSources = [];

function getAudio(){
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function stopInstrument(){
  activeSources.forEach(s=>{try{s.stop()}catch(e){}});
  activeSources=[];
  document.querySelectorAll('.instrument-card.is-playing').forEach(c=>c.classList.remove('is-playing'));
}
function envelope(g, now, attack, decay, sustain, release, peak){
  g.gain.cancelScheduledValues(now);
  g.gain.setValueAtTime(0.0001,now);
  g.gain.exponentialRampToValueAtTime(peak,now+attack);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001,peak*sustain),now+attack+decay);
  g.gain.setValueAtTime(Math.max(0.0001,peak*sustain),now+attack+decay);
  g.gain.exponentialRampToValueAtTime(0.0001,now+attack+decay+release);
}
function note(freq, duration, type='sine', gainValue=.12, detune=0, filterFreq=5000){
  const c=getAudio(), now=c.currentTime;
  const o=c.createOscillator(), g=c.createGain(), f=c.createBiquadFilter();
  o.type=type;o.frequency.value=freq;o.detune.value=detune;
  f.type='lowpass';f.frequency.value=filterFreq;f.Q.value=.6;
  o.connect(f).connect(g).connect(c.destination);
  envelope(g,now,.015,.12,.65,duration,gainValue);
  o.start(now);o.stop(now+duration+.4);activeSources.push(o);
}
function pianoNote(freq,delay=0){
  const c=getAudio(), t=c.currentTime+delay;
  [1,2,3,4].forEach((mul,i)=>{
    const o=c.createOscillator(),g=c.createGain();
    o.type=i===0?'triangle':'sine';o.frequency.value=freq*mul;
    o.connect(g).connect(c.destination);
    const a=.01+i*.004, peak=.13/(i+1);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(peak,t+a);
    g.gain.exponentialRampToValueAtTime(.0001,t+1.2-i*.12);
    o.start(t);o.stop(t+1.3);activeSources.push(o);
  });
}
function guitarNote(freq,delay=0){
  const c=getAudio(),t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
  o.type='triangle';o.frequency.value=freq;f.type='lowpass';f.frequency.value=2800;
  o.connect(f).connect(g).connect(c.destination);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.9);
  o.start(t);o.stop(t+1);activeSources.push(o);
}
function violinNote(freq,delay=0){
  const c=getAudio(),t=c.currentTime+delay,o=c.createOscillator(),l=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
  o.type='sawtooth';o.frequency.value=freq;l.type='sine';l.frequency.value=5.3;
  const lm=c.createGain();lm.gain.value=4;l.connect(lm).connect(o.detune);
  f.type='lowpass';f.frequency.value=2200;o.connect(f).connect(g).connect(c.destination);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.13,t+.16);g.gain.setValueAtTime(.13,t+.65);g.gain.exponentialRampToValueAtTime(.0001,t+1.25);
  l.start(t);o.start(t);l.stop(t+1.3);o.stop(t+1.3);activeSources.push(o,l);
}
function windNote(freq,delay=0,type='sine'){
  const c=getAudio(),t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
  o.type=type;o.frequency.value=freq;f.type='lowpass';f.frequency.value=type==='sine'?2600:1800;
  o.connect(f).connect(g).connect(c.destination);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.12,t+.12);g.gain.setValueAtTime(.12,t+.55);g.gain.exponentialRampToValueAtTime(.0001,t+1.05);
  o.start(t);o.stop(t+1.1);activeSources.push(o);
}
function drumKick(delay=0){
  const c=getAudio(),t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
  o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(55,t+.16);
  o.connect(g).connect(c.destination);g.gain.setValueAtTime(.28,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);
  o.start(t);o.stop(t+.32);activeSources.push(o);
}
function drumClick(delay=0){
  const c=getAudio(),t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
  o.type='triangle';o.frequency.value=1200;o.connect(g).connect(c.destination);
  g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+.09);
  o.start(t);o.stop(t+.1);activeSources.push(o);
}
function playInstrument(name,card){
  stopInstrument();
  if(card && card.closest) card.closest('.instrument-card')?.classList.add('is-playing');
  const melody={
    piano:[261.63,329.63,392,523.25,392,329.63],
    keyboard:[293.66,349.23,440,523.25,440,349.23],
    guitar:[196,246.94,293.66,392,329.63,293.66],
    violin:[440,523.25,659.25,587.33,523.25],
    cello:[130.81,164.81,196,261.63,196],
    flute:[523.25,587.33,659.25,783.99,659.25,587.33],
    saxophone:[220,261.63,293.66,329.63,293.66,261.63],
    trumpet:[233.08,293.66,349.23,466.16,349.23],
    drums:[1,1,1,1,1,1],
    tabla:[1,1,1,1,1,1]
  }[name] || [261.63,329.63,392];

  melody.forEach((f,i)=>{
    const d=i*.17;
    if(name==='piano'||name==='keyboard') pianoNote(f,d);
    else if(name==='guitar') guitarNote(f,d);
    else if(name==='violin'||name==='cello') violinNote(f,d);
    else if(name==='flute') windNote(f,d,'sine');
    else if(name==='saxophone') windNote(f,d,'square');
    else if(name==='trumpet') windNote(f,d,'sawtooth');
    else if(name==='drums'){drumKick(d);drumClick(d+.08)}
    else if(name==='tabla'){note(110+f*30,.22,'triangle',.18,0,1400);note(180+f*20,.12,'square',.08,0,1900)}
  });

  showToast('♪ '+name.charAt(0).toUpperCase()+name.slice(1)+' demo playing');
  setTimeout(()=>document.querySelectorAll('.instrument-card.is-playing').forEach(c=>c.classList.remove('is-playing')),1600);
}
function showToast(t){const x=document.getElementById('toast');if(!x)return;x.textContent=t;x.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>x.classList.remove('show'),1400)}
function showMentor(name,course,focus){const m=document.getElementById('mentorModal'),c=document.getElementById('mentorContent');c.innerHTML='<span class="eyebrow gold">MENTOR PROFILE</span><h2>'+name+'</h2><h3>'+course+'</h3><p style="color:#aaa;line-height:1.7">'+focus+'</p><a class="f-btn" href="contact.html">Book an enquiry ↗</a>';m.classList.add('show')}
function closeMentor(e){const m=document.getElementById('mentorModal');if(!e||e.target===m)m.classList.remove('show')}
function submitContact(e){e.preventDefault();showToast('✓ Enquiry submitted successfully');e.target.reset()}
