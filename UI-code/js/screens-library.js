!function(n){"use strict";
/* ===== کتابخانه (Library) — واژه‌نامه‌ی فارسی HSK1-3 + صداساز + تمرین نوشتن =====
   Self-contained screen for the Persian build. Uses the app's own
   STROKE (hanzi-writer) and Audio2 (TTS) modules. */
var e=n.SCREENS=n.SCREENS||{},a=UI.esc,r=UI.icon,B=n.CC&&n.CC.asset?n.CC.asset(""):"";
var D=null,DL=false,WRITER=null,WCHARS=null,WAT=0,WQUIZ=false,WWORD=null;
var FA="۰۱۲۳۴۵۶۷۸۹";
function faNum(x){return String(x).replace(/[0-9]/g,function(d){return FA[+d]})}
function load(){if(D||DL)return;DL=true;
fetch(B+"content/library/library.json").then(function(x){return x.ok?x.json():null}).then(function(j){
DL=false;if(j&&j.words){D=j.words;if(n.App&&App.screen==="library"){if(typeof App.rerender==="function")App.rerender();else if(typeof App.render==="function")App.render();refresh();}}}).catch(function(){DL=false})}
load();

/* pinyin with tone numbers -> tone marks: zhang1 -> zhāng, lv3 -> lǚ, ni3 hao2 -> nǐ hǎo */
function toneMark(syl){var m=String(syl||"").trim().toLowerCase().match(/^([a-zü]+)([1-5])?$/);
if(!m)return syl;var s=m[1],t=m[2]?+m[2]:5;
var bands=["āáǎà","ēéěè","īíǐì","ōóǒò","ūúǔù","ǖǘǚǜ"],idx=-1,band=-1;
if(s.indexOf("a")>=0){idx=s.indexOf("a");band=0}
else if(s.indexOf("e")>=0){idx=s.indexOf("e");band=1}
else if(s.indexOf("o")>=0){idx=s.indexOf("o");band=3}
else{for(var i=s.length-1;i>=0;i--){var c=s.charAt(i);
if(c==="i"){idx=i;band=2;break}
if(c==="u"){idx=i;band=4;break}
if(c==="ü"||c==="v"){idx=i;band=5;break}}}
if(idx<0||band<0)return s;
if(band===5)s=s.slice(0,idx)+"ü"+s.slice(idx+1);
return s.slice(0,idx)+(bands[band][t-1]||s.charAt(idx))+s.slice(idx+1)}
function tonePinyin(text){return String(text||"").trim().toLowerCase().split(/\s+/).map(toneMark).join(" ")}

/* Strip accents, tone marks AND tone numbers from pinyin: bàba -> baba, nǐ hǎo -> nihao, ni3 -> ni */
function stripPinyin(s){
  return String(s||"")
    .toLowerCase()
    .replace(/ü/g,"v")
    .replace(/v/g,"u")
    .replace(/[1-5]/g,"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]/g,"");
}

/* Normalize Persian/Arabic strings: remove ZWNJ, spaces, diacritics, unify yeh/kaf */
function normFa(s){
  return String(s||"")
    .toLowerCase()
    .replace(/[\u200c\u200b\u200e\u200f\s\-_·,;؛!؟?\(\)\[\]\.\/\\]/g,"")
    .replace(/[ي]/g,"ی")
    .replace(/[ك]/g,"ک")
    .replace(/[ة]/g,"ه")
    .replace(/[آأإٱ]/g,"ا")
    .replace(/[\u064b-\u065f\u0670]/g,"")
    .replace(/[۰-۹]/g,function(d){return"0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]});
}

function filtered(){
  if(!D)return[];
  var v=n.App&&App.v.lib||{},raw=String(v.q||"").trim(),lv=v.lv||"ALL";
  var list=D;
  if(lv!=="ALL"){
    list=list.filter(function(w){return w.l===lv});
  }
  if(!raw)return list;
  
  var qTokens=raw.split(/\s+/).filter(Boolean);
  var rawFa=normFa(raw);
  var rawP=stripPinyin(raw);
  var scored=[];
  
  for(var i=0;i<list.length;i++){
    var w=list[i];
    var cText=w.c||"";
    var pRaw=w.p||"";
    var pStrip=stripPinyin(pRaw);
    var mRaw=w.m||"";
    var mNorm=normFa(mRaw);
    var mParts=mRaw.split(/[;؛,\n]+/).map(normFa).filter(Boolean);
    var xRaw=w.x||"";
    var xNorm=normFa(xRaw);
    var enRaw=String(w.en||"").toLowerCase();
    
    var exFa="",exZh="",exPy="";
    for(var k=0;k<(w.e||[]).length;k++){
      var ex=w.e[k]||{};
      exFa+=" "+normFa(ex.f||"");
      exZh+=" "+(ex.c||"");
      exPy+=" "+stripPinyin(ex.p||"");
    }
    
    var score=0,allMatch=true;
    
    // Check full query match boosts first
    if(raw===cText) score+=350;
    else if(rawFa&&mParts.indexOf(rawFa)>=0) score+=320;
    else if(rawP&&rawP===pStrip) score+=300;
    else if(rawFa&&rawFa===mNorm) score+=280;
    
    for(var j=0;j<qTokens.length;j++){
      var tok=qTokens[j];
      var tokFa=normFa(tok);
      var tokP=stripPinyin(tok);
      var tokLow=tok.toLowerCase();
      var tScore=0;
      
      // 1. Chinese Characters Match
      if(tok===cText) tScore=Math.max(tScore,300);
      else if(cText.indexOf(tok)===0) tScore=Math.max(tScore,200);
      else if(cText.indexOf(tok)>=0) tScore=Math.max(tScore,140);
      else if(exZh.indexOf(tok)>=0) tScore=Math.max(tScore,40);
      
      // 2. Pinyin Match (without tone, with tone number, or partial)
      if(tokP){
        if(tokP===pStrip) tScore=Math.max(tScore,260);
        else if(pStrip.indexOf(tokP)===0) tScore=Math.max(tScore,190);
        else if(pStrip.indexOf(tokP)>=0) tScore=Math.max(tScore,130);
        else if(exPy.indexOf(tokP)>=0) tScore=Math.max(tScore,35);
      }
      
      // 3. Persian Meaning & Sub-meanings
      if(tokFa){
        if(mParts.indexOf(tokFa)>=0) tScore=Math.max(tScore,250);
        else if(tokFa===mNorm) tScore=Math.max(tScore,240);
        else if(mNorm.indexOf(tokFa)===0) tScore=Math.max(tScore,170);
        else if(mNorm.indexOf(tokFa)>=0) tScore=Math.max(tScore,110);
        else if(xNorm.indexOf(tokFa)>=0) tScore=Math.max(tScore,50);
        else if(exFa.indexOf(tokFa)>=0) tScore=Math.max(tScore,30);
      }
      
      // 4. English Translation Match
      if(tokLow){
        if(tokLow===enRaw) tScore=Math.max(tScore,90);
        else if(enRaw.indexOf(tokLow)>=0) tScore=Math.max(tScore,50);
      }
      
      if(tScore===0){
        allMatch=false;
        break;
      }
      score+=tScore;
    }
    
    if(allMatch){
      // Level tie-breaker: HSK1 (3) > HSK2 (2) > HSK3 (1)
      var lvlBonus = w.l==="HSK1"?3:(w.l==="HSK2"?2:1);
      score += lvlBonus;
      scored.push({w:w,score:score});
    }
  }
  
  scored.sort(function(a,b){return b.score-a.score});
  return scored.map(function(item){return item.w});
}

function lvlFa(l){return l==="HSK1"?"۱":l==="HSK2"?"۲":l==="HSK3"?"۳":""}

function listHtml(){
  var ws=filtered(),v=n.App&&App.v.lib||{},open=v.open,raw=String(v.q||"").trim();
  if(!D)return'<div class="lb-empty" style="text-align:center;padding:40px 20px;"><div style="font-size:14px;color:#64748B;">در حال بارگذاری دیتابیس واژه‌ها…</div></div>';
  if(!ws.length){
    return'<div class="lb-empty" style="text-align:center;padding:40px 20px;background:#FFFFFF;border-radius:20px;margin:12px 16px;border:1.5px dashed #CBD5E1;">'
      +'<div style="font-size:36px;margin-bottom:8px;">🔍</div>'
      +'<div style="font-weight:800;font-size:16px;color:#1E293B;margin-bottom:4px;">واژه‌ای برای «'+a(raw)+'» پیدا نشد</div>'
      +'<div style="font-size:12.5px;color:#64748B;margin-bottom:14px;">می‌توانید با پین‌یین، چینی یا معنی فارسی جست‌وجو کنید.</div>'
      +'<button class="lb-btn lb-btn--ghost" data-act="libClearSearch" style="display:inline-flex;width:auto;margin:0 auto;padding:7px 18px;border-radius:12px;border:1px solid #CBD5E1;background:#F8FAFC;font-size:13px;font-weight:700;color:#0F172A;cursor:pointer;">پاک کردن جست‌وجو</button>'
      +'</div>';
  }
  var h="";
  for(var i=0;i<ws.length;i++){
    var w=ws[i],on=open===w.i;
    h+='<div class="lb-w'+(on?" is-open":"")+'">'
    +'<div class="lb-w__han han" data-act="libOpen" data-arg="'+a(w.i)+'">'+a(w.c)+"</div>"
    +'<div class="lb-w__mid"><div class="lb-w__fa">'+a(w.m)+"</div>"
    +'<div class="lb-w__py py">'+a(w.p)+(w.o?' <span class="lb-pos">'+a(w.o)+"</span>":"")+' <span class="lb-lvl">'+lvlFa(w.l)+"</span></div></div>"
    +'<div class="lb-w__btns">'
    +'<button class="lb-ic" data-act="libPlay" data-arg="'+a(w.i)+'" aria-label="صدا">'+r("volume-2",19)+"</button>"
    +'<button class="lb-ic" data-act="libWrite" data-arg="'+a(w.i)+'" aria-label="تمرین نوشتن">'+r("spell-check",19)+"</button>"
    +"</div>";
    if(on){
      h+='<div class="lb-w__more">';
      if(w.x)h+='<div class="lb-expl">'+a(w.x)+"</div>";
      for(var k=0;k<(w.e||[]).length;k++){
        var ex=w.e[k]||{};
        h+='<div class="lb-ex"><div class="lb-ex__txt"><div class="lb-ex__zh han">'+a(ex.c||"")+"</div>"
        +(ex.p?'<div class="lb-ex__py py">'+a(ex.p)+"</div>":"")
        +(ex.f?'<div class="lb-ex__fa">'+a(ex.f)+"</div>":"")+"</div>"
        +'<button class="lb-ic lb-ic--sm" data-act="libSayEx" data-arg="'+a(w.i)+"|"+k+'" aria-label="صدای مثال">'+r("volume-2",15)+"</button></div>";
      }
      h+="</div>";
    }
    h+="</div>";
  }
  return h;
}

function countHtml(){
  var ws=filtered(),v=n.App&&App.v.lib||{},raw=String(v.q||"").trim(),lv=v.lv||"ALL";
  var lvName = lv==="ALL"?"همه سطوح HSK":(lv==="HSK1"?"HSK ۱":(lv==="HSK2"?"HSK ۲":"HSK ۳"));
  if(raw){
    return '<span>'+faNum(ws.length)+' واژه یافت شد</span><span style="color:#2563EB;cursor:pointer;" data-act="libClearSearch">پاک کردن</span>';
  }
  return '<span>'+faNum(ws.length)+' واژه ('+lvName+')</span><span>تلفظ و مثال فارسی</span>';
}

function chipsHtml(){
  var v=n.App&&App.v.lib||{},lv=v.lv||"ALL",q=String(v.q||"").trim();
  var baseList=D||[];
  var cnt={ALL:0,HSK1:0,HSK2:0,HSK3:0};
  if(!q){
    cnt.ALL=baseList.length;
    for(var i=0;i<baseList.length;i++){
      var l=baseList[i].l;
      if(cnt[l]!==undefined)cnt[l]++;
    }
  }else{
    var savedLv=v.lv;
    v.lv="ALL";
    var allMatched=filtered();
    v.lv=savedLv;
    cnt.ALL=allMatched.length;
    for(var j=0;j<allMatched.length;j++){
      var l2=allMatched[j].l;
      if(cnt[l2]!==undefined)cnt[l2]++;
    }
  }
  var defs=[["ALL","همه"],["HSK1","HSK ۱"],["HSK2","HSK ۲"],["HSK3","HSK ۳"]],h="";
  for(var k=0;k<defs.length;k++){
    var d=defs[k];
    h+='<button class="lb-chip'+(lv===d[0]?" on":"")+'" data-act="libLv" data-arg="'+d[0]+'">'+d[1]+' <span>'+faNum(cnt[d[0]]||0)+'</span></button>';
  }
  return h;
}

function word(i){if(!D)return null;for(var k=0;k<D.length;k++)if(D[k].i===i)return D[k];return null}
function speak(w,slow){if(!w||!n.Audio2)return;Audio2.speak(w.c,{pinyin:w.p,slow:!!slow})}

/* ===== writer overlay — uses the app's own STROKE (hanzi-writer) ===== */
function killWriter(){WRITER=null;var el=document.getElementById("lbWriter");if(el)el.innerHTML=""}
function closeOv(){killWriter();WCHARS=null;WWORD=null;var ov=document.getElementById("lbOv");if(ov)ov.parentNode.removeChild(ov)}
function buildWriter(){if(!WCHARS||!WCHARS.length)return;killWriter();
var ch=WCHARS[WAT],w=word(WWORD||""),el=document.getElementById("lbWriter");
var chEl=document.getElementById("lbOvCh"),pyEl=document.getElementById("lbOvPy"),faEl=document.getElementById("lbOvFa"),posEl=document.getElementById("lbOvPos"),noteEl=document.getElementById("lbOvNote");
if(chEl)chEl.textContent=ch;
if(pyEl&&w)pyEl.textContent=w.p||"";
if(faEl&&w)faEl.textContent=w.m||"";
if(posEl)posEl.textContent=faNum(WAT+1)+" / "+faNum(WCHARS.length);
if(noteEl)noteEl.textContent=WQUIZ?"با دست خط بکش — ترتیب و جهتِ درست مهم است.":"«نمایش ترتیب» خط‌ها را نشان می‌دهد؛ «بنویس!» تمرین با دست است.";
if(!el)return;
try{WRITER=n.STROKE.writer(el,ch,{size:272,padding:10,outline:true,character:false,speed:1,strict:false,
onError:function(){el.innerHTML='<div class="lb-writer__err">دیتای نوشتار این نویسه در دسترس نیست.</div>'}});
if(WRITER&&WQUIZ&&WRITER.quiz){WRITER.quiz({onComplete:function(){var x=document.getElementById("lbOvNote");if(x)x.textContent="آفرین! ✓"}})}
else if(WRITER&&WRITER.animateCharacter){WRITER.animateCharacter()}}catch(err){
if(el)el.innerHTML='<div class="lb-writer__err">نویسنده آماده نشد.</div>'}}

function openOv(i){var w=word(i);if(!w||!n.STROKE)return;
WWORD=i;WCHARS=Array.from(w.c);WAT=0;WQUIZ=false;
var ov=document.createElement("div");ov.id="lbOv";ov.className="lb-ov";
ov.innerHTML='<div class="lb-ov__box"><div class="lb-ov__head">'
+'<div class="lb-ov__who"><div class="lb-ov__ch han" id="lbOvCh"></div><div class="lb-ov__meta"><span class="py" id="lbOvPy"></span><span id="lbOvFa"></span></div></div>'
+'<button class="lb-ic" data-act="libOvClose" aria-label="بستن">✕</button></div>'
+'<div class="lb-ov__bar"><button class="lb-ic" data-act="libOvPrev" aria-label="نویسه‌ی قبلی">'+r("chevron-right",20)+'</button><span class="lb-ov__pos" id="lbOvPos"></span><button class="lb-ic" data-act="libOvNext" aria-label="نویسه‌ی بعدی">'+r("chevron-left",20)+"</button></div>"
+'<div class="lb-writer" id="lbWriter"></div>'
+'<div class="lb-ov__row"><button class="lb-btn" data-act="libOvAnim">'+r("play",15)+" نمایش ترتیب</button>"
+'<button class="lb-btn lb-btn--gold" data-act="libOvQuiz">بنویس!</button>'
+'<button class="lb-ic" data-act="libOvSay" aria-label="صدا">'+r("volume-2",18)+"</button></div>"
+'<div class="lb-ov__note" id="lbOvNote"></div></div>';
document.body.appendChild(ov);
ov.addEventListener("click",function(ev){if(ev.target===ov)closeOv()});
buildWriter()}

/* ===== screen render ===== */
e.library={render:function(){load();
var v=n.App&&App.v;if(!v.lib)v.lib={q:"",lv:"ALL",open:null,tts:"",py:"",ttsOpen:false};

var head='<div class="lb-top" style="position:relative;display:flex;align-items:center;justify-content:space-between;padding:12px 16px 8px;">'
+'<div style="display:flex;align-items:center;gap:12px;">'
+'<div class="lb-ico" style="width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,#3B82F6 0%,#1D4ED8 100%);display:grid;place-items:center;color:#fff;box-shadow:0 4px 12px rgba(37,99,235,0.22);flex-shrink:0;">'+r("library-big",22)+'</div>'
+'<div><div class="lb-title" style="font-size:19px;font-weight:800;color:var(--text,#0F172A);margin-bottom:1px;">کتابخانه واژگان</div>'
+'<div class="lb-sub" style="font-size:11.5px;color:var(--text2,#64748B);">'+faNum(D?D.length:1000)+' واژه‌ی HSK با تلفظ و رسم‌الخط</div></div>'
+'</div>'
+'<button class="lb-btn lb-btn--sm" data-act="libToggleTts" style="display:flex;align-items:center;gap:5px;width:auto;flex:none;padding:6px 12px;border-radius:12px;border:1px solid rgba(59,130,246,0.3);background:'+(v.lib.ttsOpen?'#3B82F6':'rgba(239,246,255,0.9)')+';color:'+(v.lib.ttsOpen?'#FFFFFF':'#2563EB')+';font-size:12px;font-weight:700;cursor:pointer;">'
+r("audio-lines",15)+'<span>صداساز</span></button>'
+'</div>';

var ttsBox='';
if(v.lib.ttsOpen){
  ttsBox='<div class="lb-card lb-tts" style="margin:0 16px 12px;border-radius:18px;border:1.5px solid rgba(59,130,246,0.25);background:linear-gradient(135deg,#F8FAFC 0%,#EFF6FF 100%);padding:14px;box-shadow:0 4px 14px rgba(37,99,235,0.06);">'
  +'<div class="lb-tts__t" style="display:flex;align-items:center;gap:8px;font-size:14px;color:#1E293B;margin-bottom:10px;"><b style="font-weight:800;">ابزار صداساز چینی</b> <span class="lb-tts__mode" style="font-size:10.5px;color:#64748B;margin-inline-start:auto;">'+a(n.Audio2&&Audio2.ttsMode?Audio2.ttsMode():"")+'</span></div>'
  +'<input id="lbTtsTxt" class="lb-in lb-in--han" dir="ltr" placeholder="متن چینی بنویس (مثلاً: 你好)…" value="'+a(v.lib.tts||"")+'" data-lb="tts" style="width:100%;box-sizing:border-box;border-radius:12px;border:1px solid #CBD5E1;padding:10px 14px;font-size:16px;background:#FFF;margin-bottom:10px;">'
  +'<div class="lb-tts__row" style="display:flex;gap:8px;margin-bottom:12px;"><button class="lb-btn" data-act="libSay" style="flex:1;border-radius:12px;padding:9px;background:#2563EB;color:#FFF;border:0;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">'+r("volume-2",15)+" پخش صدا</button>"
  +'<button class="lb-btn lb-btn--ghost" data-act="libSaySlow" style="flex:1;border-radius:12px;padding:9px;background:#FFFFFF;border:1px solid #CBD5E1;color:#1E293B;font-weight:700;cursor:pointer;">پخش آهسته</button></div>'
  +'<div class="lb-tts__py" style="display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;"><span>تلفظ هجا:</span><input id="lbTtsPy" class="lb-in lb-in--py" dir="ltr" placeholder="مثل: hao3 · zhang1" value="'+a(v.lib.py||"")+'" data-lb="py" style="flex:1;border-radius:10px;border:1px solid #CBD5E1;padding:7px 10px;font-size:13.5px;background:#FFF;">'
  +'<button class="lb-btn lb-btn--sm" data-act="libSayPy" style="border-radius:10px;padding:7px 14px;background:#0F172A;color:#FFF;border:0;font-weight:700;cursor:pointer;">پخش</button></div>'
  +'</div>';
}

var tools='<div class="lb-tools" style="padding:0 16px;">'
+'<div class="lb-search-wrap" style="position:relative;display:flex;align-items:center;margin-bottom:10px;width:100%;">'
+'<span class="lb-search-ico" style="position:absolute;inset-inline-start:14px;color:#64748B;display:flex;align-items:center;pointer-events:none;z-index:2;">'+r("search",19)+'</span>'
+'<input id="lbSearch" class="lb-in lb-in--search" placeholder="جست‌وجو: چینی، پین‌یین یا فارسی (مثلاً: ni3، سلام، 爱)..." enterkeyhint="search" value="'+a(v.lib.q||"")+'" data-lb="q" style="width:100%;box-sizing:border-box;height:48px;border-radius:16px;border:1.5px solid #CBD5E1;background:#FFFFFF;padding-inline-start:44px;padding-inline-end:38px;font-size:14px;font-family:inherit;color:#0F172A;outline:none;box-shadow:0 2px 8px rgba(15,23,42,0.04);">'
+'<button class="lb-search-clear" data-act="libClearSearch" aria-label="پاک کردن" style="position:absolute;inset-inline-end:10px;width:26px;height:26px;border-radius:50%;background:#E2E8F0;border:0;color:#475569;display:'+(v.lib.q?"flex":"none")+';align-items:center;justify-content:center;cursor:pointer;font-size:12px;font-weight:800;">✕</button>'
+'</div>'
+'<div class="lb-chips" id="lbChips" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;">'+chipsHtml()+'</div>'
+'</div>';

var countBar='<div class="lb-count-bar" id="lbCount" style="padding:6px 18px 8px;font-size:12px;font-weight:700;color:#64748B;display:flex;justify-content:space-between;align-items:center;">'+countHtml()+'</div>';

return'<div class="scr scr--tabs lb">'+head+ttsBox+tools+countBar+'<div class="lb-list" id="lbList">'+listHtml()+'</div></div>'}};

/* ===== events ===== */
document.addEventListener("click",function(ev){
var t=ev.target&&ev.target.closest?ev.target.closest("[data-act]"):null;
if(!t)return;var act=t.getAttribute("data-act");
if(!act||act.slice(0,3)!=="lib")return;
var arg=t.getAttribute("data-arg")||"",v=n.App&&App.v.lib;
if(act==="libOpen"){if(v)v.open=v.open===arg?null:arg;refresh()}
else if(act==="libLv"){if(v)v.lv=arg;refresh()}
else if(act==="libToggleTts"){
  if(v)v.ttsOpen=!v.ttsOpen;
  if(n.App&&App.render)App.render();
}
else if(act==="libClearSearch"){
  if(v)v.q="";
  var inp=document.getElementById("lbSearch");
  if(inp){inp.value="";inp.focus();}
  refresh();
}
else if(act==="libPlay"){speak(word(arg))}
else if(act==="libSayEx"){var p=arg.split("|"),w=word(p[0]),ex=w&&(w.e||[])[+p[1]];
if(ex&&n.Audio2&&ex.c)Audio2.speak(ex.c)}
else if(act==="libSay"||act==="libSaySlow"){var el=document.getElementById("lbTtsTxt"),txt=el?el.value.trim():"";
if(v)v.tts=txt;
if(txt&&n.Audio2)Audio2.speak(txt,act==="libSaySlow"?{slow:true}:undefined)}
else if(act==="libSayPy"){var el3=document.getElementById("lbTtsPy"),py=el3?el3.value.trim():"";
if(v)v.py=py;if(!py||!n.Audio2)return;
var first=py.split(/\s+/)[0],marked=toneMark(first);
if(n.Audio2.syllable&&Audio2.syllable(marked)){/* authentic recorded speaker */}
else{var note=document.createElement("div");note.className="lb-toast";note.textContent="این هجا در دیتای صدا نیست: "+marked;document.body.appendChild(note);setTimeout(function(){note.parentNode&&note.parentNode.removeChild(note)},1800)}}
else if(act==="libWrite"){if(word(arg))openOv(arg)}
else if(act==="libOvClose")closeOv();
else if(act==="libOvPrev"){if(WCHARS&&WCHARS.length){WAT=(WAT-1+WCHARS.length)%WCHARS.length;WQUIZ=false;buildWriter()}}
else if(act==="libOvNext"){if(WCHARS&&WCHARS.length){WAT=(WAT+1)%WCHARS.length;WQUIZ=false;buildWriter()}}
else if(act==="libOvAnim"){WQUIZ=false;if(WRITER&&WRITER.animateCharacter)WRITER.animateCharacter();
var nn=document.getElementById("lbOvNote");if(nn)nn.textContent="ترتیب خط‌ها را تماشا کن…"}
else if(act==="libOvQuiz"){WQUIZ=true;
if(WRITER&&WRITER.quiz){WRITER.quiz({onComplete:function(){var x=document.getElementById("lbOvNote");if(x)x.textContent="آفرین! ✓"}})}
else buildWriter();
var nn2=document.getElementById("lbOvNote");if(nn2)nn2.textContent="با دست خط بکش — ترتیب و جهتِ درست مهم است."}
else if(act==="libOvSay"){var w3=WWORD?word(WWORD):null;if(w3)speak(w3)}
},true);

/* search/tts inputs */
function onSearchInput(ev){
  var t=ev.target;if(!t||!t.getAttribute)return;
  var k=t.getAttribute("data-lb");if(!k)return;
  var v=n.App&&App.v.lib;if(!v)return;
  v[k]=t.value;
  if(k==="q"){
    clearTimeout(refresh.__t);
    refresh.__t=setTimeout(refresh,40);
  }
}
document.addEventListener("input",onSearchInput,true);
document.addEventListener("change",onSearchInput,true);
document.addEventListener("search",onSearchInput,true);

function refresh(){
  var el=document.getElementById("lbList"),ch=document.getElementById("lbChips"),cnt=document.getElementById("lbCount");
  if(el)el.innerHTML=listHtml();
  if(ch)ch.innerHTML=chipsHtml();
  if(cnt)cnt.innerHTML=countHtml();
  var clr=document.querySelector(".lb-search-clear");
  var qVal=n.App&&App.v.lib&&App.v.lib.q;
  if(clr)clr.style.display=qVal?"flex":"none";
}

document.addEventListener("keydown",function(ev){
if(ev.key==="Escape")closeOv();
if(ev.key==="Enter"&&ev.target&&ev.target.id==="lbSearch"){ev.preventDefault();ev.target.blur()}
});
}(window);
