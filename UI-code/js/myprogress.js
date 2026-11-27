!function(e){"use strict";var n=e.SCREENS=e.SCREENS||{},a=UI.esc,s=UI.act,r=UI.icon,i=864e5;function o(t){var e=t.history||[];if(!e.length)return 0;for(var n=Date.parse(e[0].at),a=1;a<e.length;a++){var s=Date.parse(e[a].at);if("known"===e[a].grade&&s-n>=72e6)return s}return 0}function c(){
    var t,n,a=Store.state||{},s=(t=a.studyingDeck||"",(n=/hsk(\d)/.exec(t)||/(\d)/.exec(a.level||""))?Number(n[1]):1),
    r="hsk"+s,saved=(typeof Store.savedWords==="function")?Store.savedWords():[],
    l=Date.now()-7*i,d=saved.map(o).filter(Boolean),u=a.useWords||{},
    pWords=Object.keys(u).map(function(t){return u[t];});

    var unitDoneCount=0;
    if(window.UnitSystem&&typeof UnitSystem.loadProgress==="function"){
        var p0=UnitSystem.loadProgress("lesson0");
        if(p0&&p0.done)unitDoneCount++;
        for(var uIdx=0;uIdx<15;uIdx++){
            var pu=UnitSystem.loadProgress("hsk1:"+uIdx);
            if(pu&&pu.done)unitDoneCount++;
        }
    }
    var legacyDone=Number((a.courseProgress||{})[r])||0;
    var totalUnits=15;
    var doneUnits=Math.min(totalUnits,Math.max(unitDoneCount,legacyDone));

    var h=(DATA.DECKS||[]).filter(function(t){return t.id===r;})[0];
    var f=(h&&h.list&&h.list.length)?h.list.length:150;
    var knownWordsCount=Math.max(saved.filter(function(w){return w.learned;}).length,doneUnits>0?doneUnits*8:0);

    var A=(DATA.GRAMMAR||[]).filter(function(t){return t.level===s||t.level==="HSK "+s;});
    var totalGrammar=A.length||15;
    var D=A.filter(function(t){return(a.grammarDone||{})[t.id];});
    var gDoneCount=Math.max(D.length,Object.keys(a.grammarDone||{}).length);

    var _=a.listen||{ok:0,n:0};
    var M=_.n>=1?Math.round((_.ok/_.n)*100):null;

    var vocabPct=Math.min(1,knownWordsCount/(f||150));
    var unitsPct=Math.min(1,doneUnits/totalUnits);
    var gramPct=Math.min(1,gDoneCount/(totalGrammar||15));
    var listenScore=(null!=M)?(M/100):(unitsPct*0.8);
    var readyPct=Math.round((vocabPct*0.4+unitsPct*0.35+gramPct*0.15+listenScore*0.1)*100);

    var P=saved.filter(function(t){
        return(t.mastery||0)<=2||t.leech||(window.Mistakes&&a.mistakes&&a.mistakes["w:"+t.hanzi]);
    }).map(function(t){return t.hanzi;});

    var y,k,z,w;
    return{
        n:s,
        done:doneUnits,
        total:totalUnits,
        remembered:Math.max(d.length,saved.filter(function(t){return(t.mastery||0)>=2;}).length),
        rememberedWeek:d.filter(function(t){return t>l;}).length,
        use:pWords.length,
        useWeek:pWords.filter(function(t){return t>l;}).length,
        due:(Store.dueToday&&Store.dueToday().length)?Store.dueToday().length:0,
        learned:saved.filter(function(t){return t.learned;}).length,
        streak:Number(a.streak)||1,
        perDay:(y=Date.now()-28*i,k=saved.filter(function(t){return(t.addedAt||0)>y;}).length,z=saved.reduce(function(t,e){return e.addedAt&&(!t||e.addedAt<t)?e.addedAt:t;},0),w=Math.max(1,Math.min(28,Math.ceil((Date.now()-Math.max(z||0,y))/i))),k?Math.max(1,Math.round(k/w)):0),
        listN:f,
        known:knownWordsCount,
        gram:totalGrammar,
        gDone:gDoneCount,
        listenPct:M,
        ready:Math.max(0,Math.min(100,readyPct)),
        weak:P,
        gWeak:A.filter(function(t){return!(a.grammarDone||{})[t.id];}).slice(0,2).map(function(t){return(e.Tr&&Tr.point?Tr.point(t):t).title||t.title||t.mark||t.id;})
    };
}
function d(t){try{return Number(t).toLocaleString("fa-IR");}catch(e){return String(t);}}
function p(t,e){return'<div class="mp-bar" style="direction:ltr;"><i class="'+(e||"")+'" style="width:'+Math.max(0,Math.min(100,Math.round(t)))+'%"></i></div>';}
function m(t,e,n,s,i,o,c,l){
    return'<div class="mp-row" style="display:flex; align-items:center; gap:12px; padding:12px 0; border-top:1px solid #f1f5f9; direction:rtl;">'+
      '<span class="mp-ico" style="background:'+e+";color:"+n+'; width:38px; height:38px; border-radius:12px; display:grid; place-items:center; flex-shrink:0;">'+r(t,18)+'</span>'+
      '<div class="mp-grow" style="flex:1; min-width:0; text-align:right;">'+
        '<div class="mp-t" style="display:flex; justify-content:space-between; align-items:center; font-size:14.5px; font-weight:700; color:var(--text, #1e293b); direction:rtl;"><span style="text-align:right;">'+a(s)+'</span><b dir="ltr" style="font-size:15px; font-weight:800; color:#0f766e; unicode-bidi:isolate;">'+a(i)+'</b></div>'+
        '<div class="mp-s" style="font-size:12px; color:var(--text3, #64748b); margin-top:2px; text-align:right;">'+a(o)+'</div>'+
        p(c,l)+
      '</div>'+
    '</div>';
}
n.myProgress={
    render:function(){
        var n,i=c(),o=Math.max(50,i.learned||50),
        v=i.ready>=90?t("mpReadyAlmost"):i.ready>=60?t("mpReadyMost"):i.ready>=35?t("mpReadyHalf"):t("mpReadyStart"),
        h=i.weak.slice(0,6).map(function(t){return'<span class="mp-chip han" style="padding:6px 12px; border-radius:12px; background:#f1f5f9; font-size:15px; font-weight:700; color:#0f766e;">'+a(t)+'</span>';}).join("")+(i.weak.length>6?'<span class="mp-chip" style="padding:6px 10px; border-radius:12px; background:#f1f5f9; font-size:13px; font-weight:600; color:#64748b;">+'+(i.weak.length-6)+'</span>':""),
        f=e.Progress&&Progress.openShare?'<button class="iconbtn" '+s("rdShare")+' aria-label="'+a(t("rdShare"))+'" style="border:none; background:transparent; cursor:pointer;">'+r("share",18)+"</button>":"";

        var headHtml='<div class="mp-nav-bar" style="flex:none; display:flex; align-items:center; justify-content:space-between; padding:calc(var(--sat, 12px) + 12px) 16px 12px; background:var(--card, #fff); border-bottom:1px solid var(--line2, #f1f5f9); direction:rtl;">'+
          '<div style="display:flex; align-items:center; gap:10px;">'+
            '<button class="iconbtn" '+s("back")+' aria-label="بازگشت" style="width:38px; height:38px; border-radius:50%; background:var(--sunk, #f1f5f9); display:grid; place-items:center; border:none; cursor:pointer;">'+r("arrow-right",18)+'</button>'+
            '<h1 style="margin:0; font-size:20px; font-weight:800; color:var(--text, #1e293b);">'+a(t("mpTitle"))+'</h1>'+
          '</div>'+
          (f||'<div></div>')+
        '</div>';

        var streakHtml='<div class="mp-card mp-streak-hero" style="background:linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border:1px solid #fed7aa; border-radius:20px; padding:16px 18px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between; direction:rtl; box-shadow:0 2px 10px rgba(249,115,22,0.06);">'+
          '<div style="display:flex; align-items:center; gap:12px;">'+
            '<div style="width:46px; height:46px; border-radius:14px; background:#fff; box-shadow:0 3px 10px rgba(249,115,22,0.18); display:grid; place-items:center; flex-shrink:0;">'+
              '<img src="art/icon_flame_3d.webp" alt="Streak" style="width:30px; height:30px; object-fit:contain;" onerror="this.onerror=null;this.src=\'css/icons/flame.svg\';">'+
            '</div>'+
            '<div style="text-align:right;">'+
              '<div style="font-size:16px; font-weight:800; color:#9a3412;">'+i.streak+' روز زنجیره مطالعه</div>'+
              '<div style="font-size:12px; color:#c2410c; margin-top:2px;">استمرار در یادگیری کلید تسلط بر زبان چینی است</div>'+
            '</div>'+
          '</div>'+
          '<span class="mp-badge-tag" style="background:#ea580c; color:#fff; font-size:12px; font-weight:700; padding:4px 10px; border-radius:99px;">فعال</span>'+
        '</div>';

        var leadHtml='<p class="mp-lead" style="direction:rtl; text-align:right; font-size:13px; line-height:1.7; color:var(--text2, #475569); margin:0 4px 14px;">'+a(t("mpLead"))+'</p>';

        var coreCardHtml='<div class="mp-card" style="direction:rtl; text-align:right; border-radius:20px; padding:16px 18px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.04); background:#fff; border:1px solid #f1f5f9;">'+
          m("graduation-cap", "#EAF1FF", "#4C7EF0", t("mpWatched"), i.done+" / "+i.total, t("mpWatchedS", {name:"HSK "+i.n}), i.total?(i.done/i.total*100):0, "b")+
          m("check", "var(--tint)", "var(--brand)", t("mpRemember"), String(i.remembered), t("mpRememberS"), (i.remembered/o*100))+
          m("pen-line", "#FFF3E2", "#F0962E", t("mpUse"), String(i.use), t("mpUseS"), (i.use/o*100), "w")+
        '</div>';

        var readyCardHtml='<div class="mp-card" style="direction:rtl; text-align:right; border-radius:20px; padding:18px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.04); background:#fff; border:1px solid #f1f5f9;">'+
          '<div class="mp-ready" style="display:flex; align-items:center; gap:16px; margin-bottom:14px; direction:rtl;">'+
            '<div class="mp-ring" style="position:relative; width:84px; height:84px; display:grid; place-items:center; flex-shrink:0;">'+
              '<svg viewBox="0 0 96 96" width="84" height="84">'+
                '<circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" stroke-width="9"/>'+
                '<circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(2.513*(n=i.ready)).toFixed(1)+' 999" transform="rotate(-90 48 48)"/>'+
              '</svg>'+
              '<b style="position:absolute; font-size:18px; font-weight:800; color:#0f766e;">'+n+'%</b>'+
            '</div>'+
            '<div style="flex:1; min-width:0; text-align:right;">'+
              '<div class="mp-cap" style="font-size:12px; font-weight:700; color:#0f766e; text-align:right;">'+a(t("mpReadyFor",{n:i.n}))+'</div>'+
              '<div class="mp-t" style="margin-top:4px; font-size:16.5px; font-weight:800; color:var(--text, #1e293b); text-align:right;"><span>'+a(v)+'</span></div>'+
              '<div class="mp-s" style="font-size:12px; color:var(--text3, #64748b); line-height:1.6; margin-top:4px; text-align:right;">'+a(t("mpReadyS"))+'</div>'+
            '</div>'+
          '</div>'+
          (i.listN?'<div class="mp-row" style="display:flex; align-items:center; gap:12px; padding:10px 0; border-top:1px solid #f1f5f9; direction:rtl;"><div class="mp-grow" style="flex:1; min-width:0; text-align:right;"><div class="mp-t" style="display:flex; justify-content:space-between; align-items:center; font-size:14px; font-weight:700; direction:rtl;"><span>'+a(t("mpWords"))+'</span><b dir="ltr" style="font-size:14.5px; font-weight:800; color:#0f766e; unicode-bidi:isolate;">'+i.known+" / "+i.listN+'</b></div>'+p(i.known/i.listN*100)+'</div></div>':"")+
          (i.gram?'<div class="mp-row" style="display:flex; align-items:center; gap:12px; padding:10px 0; border-top:1px solid #f1f5f9; direction:rtl;"><div class="mp-grow" style="flex:1; min-width:0; text-align:right;"><div class="mp-t" style="display:flex; justify-content:space-between; align-items:center; font-size:14px; font-weight:700; direction:rtl;"><span>'+a(t("mpGrammar"))+'</span><b dir="ltr" style="font-size:14.5px; font-weight:800; color:#2563eb; unicode-bidi:isolate;">'+i.gDone+" / "+i.gram+'</b></div>'+p(i.gDone/i.gram*100,"b")+'</div></div>':"")+
          '<div class="mp-row" style="display:flex; align-items:center; gap:12px; padding:10px 0; border-top:1px solid #f1f5f9; direction:rtl;"><div class="mp-grow" style="flex:1; min-width:0; text-align:right;"><div class="mp-t" style="display:flex; justify-content:space-between; align-items:center; font-size:14px; font-weight:700; direction:rtl;"><span>'+a(t("mpListen"))+'</span><b style="font-size:14.5px; font-weight:800; color:#f59e0b;">'+(null==i.listenPct?"—":i.listenPct+"%")+'</b></div>'+(null==i.listenPct?'<div class="mp-s" style="font-size:12px; color:#64748b; margin-top:3px; text-align:right;">'+a(t("mpListenNone"))+'</div>':p(i.listenPct,"w"))+'</div></div>'+
        '</div>';

        var weekCardHtml='<div class="mp-card" style="direction:rtl; text-align:right; border-radius:20px; padding:16px 18px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.04); background:#fff; border:1px solid #f1f5f9;">'+
          '<div class="mp-cap" style="font-size:12px; font-weight:700; color:#0f766e; margin-bottom:12px; text-align:right;">'+a(t("mpWeek"))+'</div>'+
          '<div class="mp-week" style="display:flex; justify-content:space-between; gap:10px; direction:rtl; text-align:center;">'+
            '<div style="flex:1; background:#f8fafc; border-radius:14px; padding:10px 6px;"><b style="display:block; font-size:18px; font-weight:800; color:#059669;">+'+i.rememberedWeek+'</b><span style="font-size:11.5px; color:#64748b;">'+a(t("mpWeekRem"))+'</span></div>'+
            '<div style="flex:1; background:#f8fafc; border-radius:14px; padding:10px 6px;"><b style="display:block; font-size:18px; font-weight:800; color:#2563eb;">+'+i.useWeek+'</b><span style="font-size:11.5px; color:#64748b;">'+a(t("mpWeekUse"))+'</span></div>'+
            '<div style="flex:1; background:#f8fafc; border-radius:14px; padding:10px 6px;"><b style="display:block; font-size:18px; font-weight:800; color:#e11d48;">'+i.due+'</b><span style="font-size:11.5px; color:#64748b;">'+a(t("mpWeekDue"))+'</span></div>'+
          '</div>'+
        '</div>';

        var askCardHtml='<div class="mp-card" style="direction:rtl; text-align:right; border-radius:20px; padding:16px 18px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.04); background:#fcfcfe; border:1px solid #f1f5f9;">'+
          '<div class="mp-t" style="font-size:15px; font-weight:800; color:var(--text, #1e293b); text-align:right; margin-bottom:6px;"><span>'+a(t("mpAsk"))+'</span></div>'+
          '<div class="mp-s" style="font-size:12.5px; color:var(--text2, #475569); line-height:1.7; text-align:right;">'+a(t("mpAskS"))+'</div>'+
        '</div>';

        var weakCardHtml="";
        if(i.weak.length||i.gWeak.length){
          weakCardHtml='<div class="mp-card" style="direction:rtl; text-align:right; border-radius:20px; padding:16px 18px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,0.04); background:#fff; border:1px solid #f1f5f9;">'+
            '<div class="mp-t" style="display:flex; justify-content:space-between; align-items:center; direction:rtl; margin-bottom:8px;">'+
              '<span>'+a(t("mpBefore"))+'</span>'+
              (i.weak.length?'<small style="font-size:12px; color:#64748b; font-weight:600;">'+a(t("mpNWords",{n:i.weak.length}))+'</small>':"")+
            '</div>'+
            (h?'<div class="mp-chips" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; direction:rtl;">'+h+'</div>':"")+
            (i.gWeak.length?'<div class="mp-s" style="font-size:12px; color:#64748b; margin-top:8px; line-height:1.6; text-align:right;">'+a(t("mpPlusGrammar",{list:i.gWeak.join("، ")}))+'</div>':"")+
          '</div>';
        }

        var ctaHtml='<button class="hm-cta mp-cta" '+s("placementTest")+' style="width:100%; border-radius:16px; padding:15px; font-size:15px; font-weight:800; margin-top:10px; margin-bottom:24px; box-shadow:0 4px 14px rgba(16,185,129,0.25); cursor:pointer;">'+a(t("mpCheck"))+'</button>';

        return '<div class="col mp" style="direction:rtl; text-align:right; max-width:540px; width:100%; height:100%; margin:0 auto; display:flex; flex-direction:column; overflow:hidden;">'+
          headHtml+
          '<div class="col__body" style="flex:1; min-height:0; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:12px 16px calc(max(var(--sab, 24px), 24px) + 52px);">'+
            streakHtml+
            leadHtml+
            coreCardHtml+
            readyCardHtml+
            weekCardHtml+
            askCardHtml+
            weakCardHtml+
            ctaHtml+
          '</div>'+
        '</div>';
    }
};var v=[{k:"offline",ico:"download",bg:"#EAF1FF",fg:"#4C7EF0",go:{a:"go",arg:{s:"down"}}},{k:"podcast",ico:"headphones",bg:"#FFF3E2",fg:"#F0962E",need:"Podcast",go:{a:"go",arg:{s:"podcast"}}},{k:"blind",ico:"eye-off",bg:"var(--tint)",fg:"var(--brand)"},{k:"slow",ico:"clock",bg:"#F3EEFF",fg:"#7C5CE0"},{k:"write",ico:"pen-line",bg:"#FFEDEB",fg:"#E0605A",go:{a:"go",arg:{s:"strokeHome"}}},{k:"feedback",ico:"message-circle",bg:"#EAF7FF",fg:"#2C8BC9",go:{a:"go",arg:{s:"help"}}}];function h(){return v.filter(function(t){return(!t.need||e[t.need])&&(!t.go||n[t.go.arg.s])})}function f(e,n){return'<span class="mp-ico" style="background:'+e.bg+";color:"+e.fg+'">'+r(e.ico,17)+'</span><div class="mp-grow"><div class="'+n+'">'+a(t("tip_"+e.k))+'</div><div class="mp-s">'+a(t("tip_"+e.k+"S"))+"</div></div>"}function g(t){var e=t?new Date(t):new Date;return e.setHours(12,0,0,0),e.setDate(e.getDate()-(e.getDay()+6)%7),Store.dayKey(e)}function b(){var t=g(),e=Store.state.focus||{};return Store.savedWords().filter(function(n){return e[n.id]===t})}function S(t){var e=Object.assign({},Store.state.focus||{});e[t]===g()?delete e[t]:e[t]=g(),Store.set({focus:e})}function y(){var n=Store.state.studyingDeck&&DATA.COURSES[Store.state.studyingDeck]?Store.state.studyingDeck:"hsk1",a=DATA.COURSES[n];if(!a)return null;var s=Math.min(Number((Store.state.courseProgress||{})[n])||0,(a.lessons||[]).length-1),r=e.LessonPlan?e.LessonPlan(n,s):null;if(!r||!r.words||!r.words.length)return null;var i=r.words.map(function(t){var e=Store.findWord(t.hanzi,t.py);return e&&e.learned?e.id:null}).filter(Boolean);return{name:t("lessonNum",{n:(s+1<10?"0":"")+(s+1)})+" · "+((a.lessons[s]||{}).title||""),ids:i,n:r.words.length}}function k(){var t=Store.state.lastStudy;if(!t||!Store.savedWords().some(function(t){return t.learned}))return 0;var e=Math.floor((Date.parse(Store.dayKey()+"T12:00:00")-Date.parse(String(t).slice(0,10)+"T12:00:00"))/i);return e>=3?e:0}function z(){return Store.savedWords().filter(function(t){return t.learned}).sort(function(t,e){return(e.mastery||0)-(t.mastery||0)}).slice(0,5)}n.tips={render:function(){return'<div class="col mp">'+UI.head(t("tipsTitle",{n:h().length}))+'<div class="col__body">'+h().map(function(t){return'<button class="mp-card mp-tipc" '+(t.go?s(t.go.a,t.go.arg):"")+(t.go?"":" disabled")+">"+f(t,"mp-t")+(t.go?UI.chevron():"")+"</button>"}).join("")+"</div></div>"}},e.Progress2Actions={focusToggle:function(t){S(t.id),App.render()},focusAddNext:function(){var t=y();if(t){var e=Object.assign({},Store.state.focus||{}),n=g();t.ids.forEach(function(t){e[t]=n}),Store.set({focus:e}),App.render()}},focusPractise:function(){var t=b();t.length&&e.MistakesActions&&MistakesActions.mkPractiseWords(t)},comebackGo:function(){UI.layerOpen&&UI.layerOpen()&&UI.closeLayer(),Store.set({comebackDone:Store.dayKey()});var n=z();n.length&&e.MistakesActions?MistakesActions.mkPractiseWords(n):App.act("reviewDue");var a=Store.dueToday?Store.dueToday().length:0;App.v.mkq&&a&&(App.v.mkq.then={act:"comebackMore",label:t("cbMore",{n:Math.min(a,20)})})},comebackMore:function(){App.act("reviewDue")}};var w=85,A=160,D=[88,100,115,130];function _(){var t=Store.state||{},e=Number(t.zhPct);return e||null==t.zhSize||(e=D[t.zhSize]||100),e=e||100,Math.max(w,Math.min(A,5*Math.round(e/5)))}function M(t){var e=document.documentElement;e&&e.style&&e.style.setProperty&&e.style.setProperty("--zh",String((t||_())/100))}function F(t){var e=document.querySelector(".zh-ctl");if(e){var n=e.querySelector(".zh-ctl__val"),a=e.querySelector(".zh-range");n&&(n.textContent=t+"%"),a&&Number(a.value)!==t&&(a.value=String(t)),a&&a.style.setProperty("--fill",(t-w)/75*100+"%");var s=e.querySelector('[data-zhd="-"]'),r=e.querySelector('[data-zhd="+"]'),i=document.querySelector(".zh-reset");s&&(s.disabled=t<=w),r&&(r.disabled=t>=A),i&&(i.hidden=100===t)}}function E(t){(t=Math.max(w,Math.min(A,5*Math.round(Number(t)/5))))!==Number(Store.state.zhPct)&&Store.set({zhPct:t}),M(t),F(t)}M(),Store.on&&Store.on(function(){M()}),e.Progress2Actions.zhStep=function(t){E(_()+(Number(t.d)||0)),e.Audio2&&Audio2.buzz&&Audio2.buzz("press")},e.Progress2Actions.zhReset=function(){E(100)};var P=0;document.addEventListener("input",function(t){var n=t.target;if(n&&n.classList&&n.classList.contains("zh-range")){var a=Number(n.value);M(a),F(a),a!==P&&e.Audio2&&Audio2.buzz&&Audio2.buzz("press"),P=a}}),document.addEventListener("change",function(t){var e=t.target;e&&e.classList&&e.classList.contains("zh-range")&&E(e.value)}),e.Progress2={used:function(t){if(t&&t.length){var e=Object.assign({},Store.state.useWords||{}),n=Date.now();t.forEach(function(t){t&&/[㐀-鿿]/.test(t)&&!e[t]&&(e[t]=n)}),Store.set({useWords:e})}},heard:function(t){var e=Store.state.listen||{ok:0,n:0};Store.set({listen:{ok:(e.ok||0)+(t?1:0),n:(e.n||0)+1}})},counts:c,zhPicker:function(){var e=_(),n=(e-w)/75*100+"%";P=e;var r=!1!==Store.state.pinyinOn;return'<div class="zh-prev"><div class="zh-prev__zh">'+[["你好！",["nǐ","hǎo",""]],["我叫小雨。",["wǒ","jiào","Xiǎo","yǔ",""]]].map(function(t){return'<span class="zh-grp">'+Array.from(t[0]).map(function(e,n){return'<span class="zh-cell">'+(r?"<i>"+(t[1][n]||"&nbsp;")+"</i>":"")+"<b>"+e+"</b></span>"}).join("")+"</span>"}).join("")+'</div><div class="zh-prev__en">'+a(t("zhPrevEn"))+'</div></div><div class="zh-ctl"><button class="zh-ctl__btn" data-zhd="-" '+s("zhStep",{d:-5})+(e<=w?" disabled":"")+' aria-label="'+a(t("zhSmaller"))+'"><span class="zh-a zh-a--s">A</span></button><input class="zh-range" type="range" min="85" max="'+A+'" step="5" value="'+e+'" aria-label="'+a(t("zhSize"))+'" style="--fill:'+n+'"><button class="zh-ctl__btn" data-zhd="+" '+s("zhStep",{d:5})+(e>=A?" disabled":"")+' aria-label="'+a(t("zhLarger"))+'"><span class="zh-a zh-a--l">A</span></button><b class="zh-ctl__val">'+e+'%</b></div><button class="zh-reset" '+s("zhReset")+(100===e?" hidden":"")+">"+a(t("zhReset"))+"</button>"},zhPct:_},e.Tips={homeCard:function(){var e=h();if(!e.length||Store.state.tipsOff)return"";var n=Math.floor((Date.now()-6e4*(new Date).getTimezoneOffset())/i),o=Store.state.tipsSeen||{},c=e.filter(function(t){return o[t.k]===n})[0]||e.filter(function(t){return null==o[t.k]})[0];if(!c)return"";if(o[c.k]!==n){var l=Object.assign({},o);l[c.k]=n,setTimeout(function(){Store.set({tipsSeen:l})},0)}return'<div class="hm-card mp-tip"><button class="mp-tip__main" '+s("go",{s:"tips"})+">"+f(c,"mp-t mp-t--tip")+"</button>"+(c.go?'<button class="mp-tip__go" '+s(c.go.a,c.go.arg)+">"+a(t("tipShow"))+"</button>":"")+'<button class="mp-tip__x" '+s("tipsClose")+' aria-label="'+a(t("close"))+'">'+r("x",15)+"</button></div>"},list:h},e.Focus={week:g,is:function(t){return(Store.state.focus||{})[t]===g()},words:b,toggle:S,tab:function(){var n=b(),i=y(),o=n.map(function(n){var s=function(t){var e=Date.parse(g()+"T00:00:00");return(t.history||[]).filter(function(t){return"known"===t.grade&&Date.parse(t.at)>=e}).length}(n);return'<div class="mp-row"><span class="mp-star">'+r("star",16)+'</span><div class="mp-grow"><b class="mp-fz">'+a(n.hanzi)+'</b><div class="mp-s">'+a((n.pinyin||"")+" · "+(e.Mistakes?Mistakes.gloss(n):""))+'</div></div><span class="mp-s">'+a(s?t("focusRightN",{n:s}):t("focusNotYet"))+"</span></div>"}).join("");return'<div class="mp-card"><div class="mp-s">'+a(n.length?t("focusLead"):t("focusEmpty"))+"</div>"+o+"</div>"+(i&&i.ids.length?'<div class="mp-card mp-next"><div class="mp-grow"><div class="mp-t"><span>'+a(t("focusAddNext"))+'</span></div><div class="mp-s">'+a(i.name+" · "+t("focusNWords",{n:i.ids.length}))+'</div></div><button class="mp-add" '+s("focusAddNext")+">"+a(t("focusAdd"))+"</button></div>":"")}},e.Comeback={card:function(){if(!k()||Store.state.comebackDone===Store.dayKey())return"";var e=Store.savedWords().filter(function(t){return t.learned}).length,n=function(e,n,r,i){return'<button class="mp-row mp-cb__row" '+s(i)+'><span class="mp-cb__n">'+e+'</span><span class="mp-grow">'+a(n)+"</span><small>"+a(t("hmMins",{m:r}))+"</small></button>"};return'<div class="hm-card mp-cb"><div class="mp-cb__top"><img src="'+CC.asset("art/mascot/onb-hi.webp")+'" alt=""><div><div class="mp-cb__t">'+a(t("cbTitle"))+'</div><div class="mp-s">'+a(t("cbSub",{n:e}))+"</div></div></div>"+n(1,t("cbStep1"),2,"comebackGo")+n(2,t("cbStep2"),1,"homeWatch")+n(3,t("cbStep3"),2,"homeLearn")+'<button class="hm-cta" '+s("comebackGo")+">"+a(t("cbGo"))+"</button></div>"},away:k,sheet:function(){if(k()&&Store.state.comebackDone!==Store.dayKey()&&Store.state.comebackSheet!==Store.dayKey()&&(!UI.layerOpen||!UI.layerOpen())){Store.set({comebackSheet:Store.dayKey()}),"home"===App.screen&&App.render();var n=Store.savedWords().filter(function(t){return t.learned}).length,r=[[-70,18,"#FFC94A",.5],[62,8,"#62DBBB",.58],[-34,-6,"#FF8F86",.66],[44,-14,"#FFC94A",.74]].map(function(t){return'<i class="cb-star" style="left:calc(50% + '+t[0]+"px);top:"+t[1]+"px;background:"+t[2]+";animation-delay:"+t[3]+'s"></i>'}).join("");UI.layer('<button class="scrim" '+s("closeSheet")+' aria-label="'+a(t("close"))+'"></button><div class="sheet cb-sheet" role="dialog" aria-label="'+a(t("cbTitle"))+'">'+r+'<img class="cb-pup" src="'+CC.asset("art/mascot/onb-hi.webp")+'" alt=""><div class="cb-sheet__t">'+a(t("cbTitle"))+'</div><div class="cb-sheet__s">'+a(t("cbSub",{n:n}))+'</div><button class="hm-cta" '+s("comebackGo")+">"+a(t("cbGo"))+'</button><button class="ac-later" '+s("closeSheet")+">"+a(t("acRemLater"))+"</button></div>"),e.Audio2&&Audio2.buzz&&(Audio2.buzz("rise"),setTimeout(function(){Audio2.buzz("stamp")},600))}},five:z}}(window);