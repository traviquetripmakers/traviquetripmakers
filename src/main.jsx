import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BusFront, CalendarDays, Check, ChevronLeft, ChevronRight, Compass, MapPin, Menu, MessageCircle, Send, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import { packages, durationOptions } from "./packageData";
import "./styles.css";

const WA = "https://wa.me/919037188749";
const guideDestinations = [
  "Munnar","Wayanad","Vagamon","Kodaikanal","Ooty","Coorg","Mysore","Kochi","Varkala","Thekkady","Ramakkalmedu","Marayoor","Chikmagalur","Bangalore","Athirappilly","Idukki"
];
const destinationAliases = {
  munnar:"Munnar", wayanad:"Wayanad", vagamon:"Vagamon", wagamon:"Vagamon", kodaikanal:"Kodaikanal", kodai:"Kodaikanal",
  ooty:"Ooty", coorg:"Coorg", madikeri:"Coorg", mysore:"Mysore", mysuru:"Mysore", bangalore:"Bangalore", bengaluru:"Bangalore",
  kochi:"Kochi", ernakulam:"Ernakulam", varkala:"Varkala", thekkady:"Thekkady", kumily:"Thekkady", marayoor:"Marayoor",
  ramakkalmedu:"Ramakkalmedu", idukki:"Idukki", athirappilly:"Athirappilly", athirapally:"Athirappilly", alappuzha:"Alappuzha",
  alleppey:"Alappuzha", chikmagalur:"Chikmagalur", bekal:"Bekal", paithalmala:"Paithalmala", palakkayam:"Palakkayam Thattu", "pazhassi dam":"Pazhassi Dam"
};

const featuredIds = ["munnar-1d", "3d4n-05", "3d4n-10"];
const featured = featuredIds.map((id) => packages.find((p) => p.id === id)).filter(Boolean);
const packageByKey = (days, nights) => packages.filter((p) => p.duration.days === days && p.duration.nights === nights);
const destinationImage = (d) => packages.find((p) => p.destinations.includes(d))?.image || packages[0].image;

function durationLabel(p) {
  return p.durationLabel || `${p.duration.days} Days / ${p.duration.nights} Nights`;
}
function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9+\s]/g, " ").replace(/\s+/g, " ").trim();
}
function findMentionedDestination(q) {
  const n = normalize(q);
  const hit = Object.entries(destinationAliases).find(([alias]) => n.includes(alias));
  return hit?.[1] || guideDestinations.find((d) => n.includes(d.toLowerCase())) || null;
}
function findPackage(q) {
  const n = normalize(q);
  return packages.find((p) => normalize(p.name).includes(n) || normalize(p.destinations.join(" + ")).includes(n)) || null;
}
function intentFor(q) {
  const n = normalize(q);
  if (/^hi$|^hello$|^hey$|good morning|good evening|good afternoon/.test(n)) return "greeting";
  if (/how.*(work|plan|select)|planner|choose.*trip|book.*trip|booking process/.test(n)) return "how";
  if (/price|cost|fare|rate|how much|budget/.test(n)) return "price";
  if (/how many.*package|packages.*available|total.*package/.test(n)) return "count";
  if (/itinerary|schedule|day by day|stay|hotel|distance|route/.test(n)) return "detail";
  if (/recommend|suggest|best|which.*trip|where.*go|trip.*idea|ideas/.test(n)) return "recommend";
  return "destination";
}

function guideReply(question, lastPackage) {
  const q = question.trim();
  const n = normalize(q);
  const intent = intentFor(q);
  if (intent === "greeting") return {text:"Hey 👋 I’m Travique Guide. Tell me a place, a vibe, or how many days you have — I’ll use Travique’s planned routes, not random combinations.", package:null};
  if (intent === "how") return {text:"Easy. We do it the trip-maker way: 1) choose your duration → 2) choose the main destination → 3) add the next stops only from routes we already planned → 4) review the exact package and send the enquiry on WhatsApp.", package:null};
  if (intent === "price") return {text:"I don’t have live package fares in the published route data, so I won’t invent a price. Pick a package and I’ll take you to the WhatsApp enquiry flow for the current fare.", package:null};
  if (intent === "count") return {text:`Travique Guide currently knows ${packages.length} published route records from the package database. You don’t need to browse all of them — I can narrow it down for you.`, package:null};

  const exact = findPackage(q);
  if (exact) {
    return {text:`That’s a real Travique route: **${exact.name}** · ${durationLabel(exact)}. ${exact.highlights?.slice(0,3).join(" · ") || "Planned route with highlights and stays"}.`, package:exact};
  }

  const d = findMentionedDestination(q);
  if (d) {
    const matches = packages.filter((p) => p.destinations.includes(d) || p.highlights?.some((h) => normalize(h).includes(normalize(d))));
    const ranked = [...matches].sort((a,b)=>a.destinations.length-b.destinations.length).slice(0,3);
    if (intent === "detail" && ranked[0]) {
      const p = ranked[0];
      const bits = [
        `${p.name} · ${durationLabel(p)}.`,
        p.distance?.approximateTotal || p.distance?.oneWay ? `Distance: ${p.distance.approximateTotal || p.distance.oneWay}.` : null,
        p.stays?.length ? `Stay: ${p.stays.slice(0,2).join(" · ")}.` : null,
        p.highlights?.length ? `Highlights: ${p.highlights.slice(0,5).join(", ")}.` : null
      ].filter(Boolean);
      return {text:bits.join(" "),package:p};
    }
    return {text:`For ${d}, I’d look at these first:\n• ${ranked.map((p)=>`${p.name} — ${durationLabel(p)}`).join("\n• ")}\n\nOpen one in the planner and I’ll walk you through the route.`,package:ranked[0]||null};
  }

  if (intent === "recommend") {
    const keys = ["mountain","hill","tea","waterfall","forest","beach","city","heritage","coffee","nature","theme park","fun","photography"];
    const chosen = keys.find((k)=>n.includes(k));
    let ranked = packages;
    if (chosen) ranked = packages.filter(p=>p.highlights?.some(h=>normalize(h).includes(chosen)) || normalize(p.name).includes(chosen));
    ranked = ranked.slice(0,3);
    return {text:`A few routes that fit that mood:\n• ${ranked.map((p)=>`${p.name} — ${durationLabel(p)}`).join("\n• ")}\n\nTell me your days or a place and I’ll narrow it down further.`,package:ranked[0]||null};
  }

  if (lastPackage && /that|this|it|more/.test(n)) return {text:`Sure — **${lastPackage.name}** is ${durationLabel(lastPackage)}. The route is ${lastPackage.route?.join(" → ") || lastPackage.destinations.join(" → ")}. Want the highlights, stay details, or to open the enquiry?`,package:lastPackage};
  return {text:"I can help with real Travique packages, route combinations, trip duration, highlights and enquiries. Try “Munnar”, “3 day trip”, “mountain trip”, or “how does the planner work?”",package:null};
}

function Guide({onStartPlanner}) {
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState("");
  const [lastPackage,setLastPackage]=useState(null);
  const [messages,setMessages]=useState([{role:"guide",text:"Hi 👋 I’m Travique Guide. Where are you thinking of going?"}]);
  const send=(text=input)=>{
    if(!text.trim()) return;
    const reply=guideReply(text,lastPackage);
    setMessages(m=>[...m,{role:"user",text:text.trim()},{role:"guide",text:reply.text}]);
    if(reply.package) setLastPackage(reply.package);
    setInput("");
  };
  const close=setOpen;
  return <>
    <button className="guideBubble" onClick={()=>setOpen(true)} aria-label="Open Travique Guide"><Compass size={18}/><span>Travique Guide</span></button>
    {open&&<div className="guideBackdrop" onClick={()=>close(false)}><aside className="guidePanel" onClick={e=>e.stopPropagation()}>
      <div className="guideHead"><div className="guideAvatar"><Compass size={19}/></div><div><strong>Travique Guide</strong><span>Knows our planned routes</span></div><button onClick={()=>close(false)}><X size={18}/></button></div>
      <div className="guideMessages">{messages.map((m,i)=><div key={i} className={`guideMsg ${m.role}`}>{m.text.split("\n").map((line,j)=><React.Fragment key={j}>{j>0&&<br/>}{line}</React.Fragment>)}</div>)}</div>
      <div className="guideQuick"><button onClick={()=>send("Suggest a mountain trip")}>Mountain trip</button><button onClick={()=>send("Munnar routes")}>Munnar routes</button><button onClick={()=>send("1 day ideas")}>1 day ideas</button></div>
      <div className="guideActions"><button onClick={()=>{close(false);onStartPlanner();}}>Plan with me <ArrowRight size={15}/></button></div>
      <form className="guideInput" onSubmit={e=>{e.preventDefault();send();}}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about a route..."/><button><Send size={16}/></button></form>
    </aside></div>}
  </>;
}

function App(){
  const [menu,setMenu]=useState(false);
  const [planner,setPlanner]=useState({duration:null,main:null,selected:[],candidates:[],result:null});
  const [formDone,setFormDone]=useState(false);

  const durationPackages=planner.duration ? packageByKey(planner.duration.days,planner.duration.nights) : [];
  const availableMains=useMemo(()=>[...new Set(durationPackages.flatMap(p=>p.destinations))].sort((a,b)=>a.localeCompare(b)),[durationPackages]);
  const remaining=[...new Set(planner.candidates.flatMap(p=>p.destinations.filter(d=>!planner.selected.includes(d))))].sort((a,b)=>a.localeCompare(b));
  const exact=planner.candidates.find(p=>p.destinations.length===planner.selected.length&&p.destinations.every(d=>planner.selected.includes(d)));

  const startPlanner=()=>{
    setFormDone(false);
    setPlanner({duration:null,main:null,selected:[],candidates:[],result:null});
    setTimeout(()=>document.querySelector("#planner")?.scrollIntoView({behavior:"smooth"}),20);
  };
  const chooseDuration=(opt)=>{
    setFormDone(false);
    setPlanner({duration:opt,main:null,selected:[],candidates:packageByKey(opt.days,opt.nights),result:null});
  };
  const chooseMain=(d)=>{
    const candidates=packageByKey(planner.duration.days,planner.duration.nights).filter(p=>p.destinations.includes(d));
    setPlanner(p=>({...p,main:d,selected:[d],candidates,result:null}));
  };
  const chooseNext=(d)=>{
    const next=[...planner.selected,d];
    const candidates=planner.candidates.filter(p=>next.every(x=>p.destinations.includes(x)));
    setPlanner(p=>({...p,selected:next,candidates,result:null}));
  };
  const finish=(p)=>{setFormDone(false);setPlanner(s=>({...s,result:p}));setTimeout(()=>document.querySelector("#result")?.scrollIntoView({behavior:"smooth",block:"start"}),20);};
  const backPlanner=()=>{
    if(!planner.duration){return;}
    if(planner.result){setPlanner(p=>({...p,result:null}));return;}
    if(planner.selected.length>1){
      const next=planner.selected.slice(0,-1);
      const candidates=packageByKey(planner.duration.days,planner.duration.nights).filter(p=>next.every(x=>p.destinations.includes(x)));
      setPlanner(p=>({...p,selected:next,candidates,result:null}));return;
    }
    if(planner.main){setPlanner(p=>({...p,main:null,selected:[],candidates:packageByKey(p.duration.days,p.duration.nights),result:null}));return;}
    setPlanner({duration:null,main:null,selected:[],candidates:[],result:null});
  };
  const resetPlanner=()=>{setFormDone(false);setPlanner({duration:null,main:null,selected:[],candidates:[],result:null});};
  const completeWhatsApp=(e)=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget); const p=planner.result; if(!p)return;
    const msg=["Hello Travique Trip Makers,","I want to enquire about this planned package:",`Package: ${p.name}`,`Duration: ${durationLabel(p)}`,`Route: ${(p.route||[]).join(" → ")}`,`Name: ${data.get("name")}`,`Contact - 1: ${data.get("contact1")}`,`Contact - 2: ${data.get("contact2")}`,`Place: ${data.get("place")}`].join("\n");
    setFormDone(true); window.open(`${WA}?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
  };

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="#top" onClick={()=>setMenu(false)}><span className="brandIcon">T</span><span className="brandWords"><strong>TRAVIQUE</strong><small>TRIP MAKERS</small></span></a>
      <nav><a href="#planner">Plan your trip</a><a href="#trips">Featured</a><a href="#service">Why us</a><a href="#contact">Contact</a></nav>
      <button className="headerCta" onClick={startPlanner}>Plan a Trip <ArrowRight size={16}/></button>
      <button className="menuBtn" onClick={()=>setMenu(!menu)} aria-label="Menu">{menu?<X/>:<Menu/>}</button>
    </header>
    {menu&&<div className="mobileNav"><a href="#planner" onClick={()=>setMenu(false)}>Plan your trip</a><a href="#trips" onClick={()=>setMenu(false)}>Featured</a><a href="#service" onClick={()=>setMenu(false)}>Why us</a><a href="#contact" onClick={()=>setMenu(false)}>Contact</a></div>}

    <main id="top">
      <section className="hero">
        <div className="heroPhoto"/><div className="heroOverlay"/>
        <div className="heroContent">
          <div className="eyebrow"><span/> GROUP TOURS • ALL KERALA SERVICE</div>
          <div className="heroPill"><Compass size={15}/> CURATED JOURNEYS · KANNUR START</div>
          <h1>Don’t scroll<br/><em>for a trip.</em></h1>
          <p>Build one. Choose the time you have, pick the place you want, and let Travique reveal the route we’ve already planned.</p>
          <div className="heroActions"><button className="heroPrimary" onClick={startPlanner}>Build my trip <ArrowRight size={16}/></button><button className="heroSecondary" onClick={()=>document.querySelector("#trips")?.scrollIntoView({behavior:"smooth"})}>See a few ideas</button></div>
          <div className="quickSearch"><span>Try</span>{["Munnar","Munnar + Marayoor","Coorg + Mysore","3 Days"].map(x=><button key={x} onClick={()=>{document.querySelector("#planner")?.scrollIntoView({behavior:"smooth"});}}>{x}</button>)}</div>
        </div>
        <div className="heroCard"><div className="heroCardImage"><img src={featured[0]?.image} alt="Munnar hills"/></div><div className="heroCardBody"><small>ONE-DAY ESCAPE</small><strong>Munnar</strong><span>Tea roads · waterfalls · viewpoints</span><button onClick={startPlanner}>Take me there <ArrowRight size={14}/></button></div></div>
        <div className="heroFoot"><span><Check size={14}/> Planned routes</span><span><Check size={14}/> AC / non-AC</span><span><Check size={14}/> WhatsApp enquiries</span></div>
      </section>

      <section className="manifesto" id="story"><div className="manifestoTitle"><span className="kicker">THE IDEA</span><h2>Less browsing.<br/><i>More going.</i></h2></div><div className="manifestoText"><p>We don’t want a giant wall of package cards. We want the site to feel like a trip maker sitting beside you, narrowing things down until one route feels right.</p><div className="miniStats"><div><strong>4</strong><span>planning steps</span></div><div><strong>{packages.length}</strong><span>route records</span></div><div><strong>1</strong><span>guide to ask</span></div></div></div></section>

      <section className="featuredSection" id="trips">
        <div className="sectionHead"><div><span className="kicker">A FEW WAYS TO GO</span><h2>Start with a <i>feeling.</i></h2></div><button className="textLink" onClick={startPlanner}>Build my own <ArrowRight size={16}/></button></div>
        <div className="featuredGrid">
          {featured.map((p,i)=><article className={`featureCard f${i}`} key={p.id}>
            <img src={p.image} alt={p.name} loading="lazy"/><div className="featureShade"/><div className="featureTop"><span>{durationLabel(p)}</span><span>{i===0?"QUICK":i===1?"MOUNTAIN ROUTE":"COFFEE + CITY"}</span></div><div className="featureBody"><small>{p.tripStyle || "CURATED JOURNEY"}</small><h3>{p.name}</h3><p>{(p.highlights||[]).slice(0,3).join(" · ")}</p><button onClick={()=>{setPlanner({duration:{...durationOptions.find(o=>o.days===p.duration.days&&o.nights===p.duration.nights)},main:null,selected:[],candidates:packageByKey(p.duration.days,p.duration.nights),result:p});setFormDone(false);setTimeout(()=>document.querySelector("#planner")?.scrollIntoView({behavior:"smooth"}),20);}}>Open this route <ArrowRight size={15}/></button></div>
          </article>)}
        </div>
        <div className="featuredHint"><Sparkles size={15}/> These are only examples. The full package database appears naturally inside the planner when your choices narrow it down.</div>
      </section>

      <section className="plannerSection" id="planner">
        <div className="plannerIntro"><span className="kicker">THE TRIP MAKER METHOD</span><h2>Build the trip.<br/><i>Not a giant list.</i></h2><p>Every choice below filters the next one. You only see destinations that belong to real Travique route combinations.</p></div>
        <div className="plannerShell">
          <div className="plannerTop"><div className="plannerSteps">{[1,2,3,4].map((n)=><span key={n} className={n <= (planner.result?4:planner.selected.length?Math.min(3,2+planner.selected.length):planner.main?2:planner.duration?1:0)?"active":""}>{String(n).padStart(2,"0")}</span>)}</div><button className="plannerReset" onClick={resetPlanner}>Reset</button></div>
          {!planner.duration&&<div className="plannerPane"><div className="paneCopy"><span className="stepTag">STEP 01</span><h3>How long do you want to disappear?</h3><p>Pick the format first. We’ll keep every next choice connected to the package database.</p></div><div className="choiceGrid durationChoices">{durationOptions.map(opt=><button key={opt.key} className="plannerChoice durationChoice" onClick={()=>chooseDuration(opt)}><div><strong>{opt.label}</strong><span>{opt.note}</span></div><ChevronRight size={19}/></button>)}</div></div>}

          {planner.duration&&!planner.main&&!planner.result&&<div className="plannerPane"><div className="paneCopy"><span className="stepTag">STEP 02</span><h3>Pick your first place.</h3><p>These are only the destinations available inside <b>{planner.duration.label}</b> routes.</p></div><div className="choiceGrid imageChoices">{availableMains.map(d=><button key={d} className="plannerChoice imageChoice" onClick={()=>chooseMain(d)}><img src={destinationImage(d)} alt=""/><span className="choiceOverlay"/><div><strong>{d}</strong><span>Start here</span></div><ChevronRight size={18}/></button>)}</div><div className="plannerActions"><button className="ghostBtn" onClick={backPlanner}><ChevronLeft size={16}/> Change duration</button></div></div>}

          {planner.duration&&planner.main&&!planner.result&&<div className="plannerPane"><div className="paneCopy"><span className="stepTag">STEP {String(Math.min(4,planner.selected.length+2)).padStart(2,"0")}</span><h3>Your route starts at <i>{planner.main}</i>.</h3><p>Now add only a destination that exists in one of the planned combinations still matching your choices.</p></div>{exact&&<div className="exactBanner"><div><span className="tinyKicker">MATCH FOUND</span><strong>{exact.name}</strong><span>This selection already matches a complete package.</span></div><button onClick={()=>finish(exact)}>Use this route <ArrowRight size={15}/></button></div>}<div className="routeStrip"><span className="routeStart">KANNUR</span>{planner.selected.map((d,i)=><React.Fragment key={`${d}-${i}`}><b>→</b><span className="routePlace">{d}</span></React.Fragment>)}<b>→</b><span className="routeStart">KANNUR</span></div>{remaining.length>0&&<div className="choiceGrid imageChoices">{remaining.map(d=><button key={d} className="plannerChoice imageChoice" onClick={()=>chooseNext(d)}><img src={destinationImage(d)} alt=""/><span className="choiceOverlay"/><div><strong>Add {d}</strong><span>Continue the route</span></div><ChevronRight size={18}/></button>)}</div>}<div className="plannerActions"><button className="ghostBtn" onClick={backPlanner}><ChevronLeft size={16}/> Back</button></div></div>}

          {planner.result&&<div className="resultPane" id="result"><div className="resultImage"><img src={planner.result.image} alt={planner.result.name}/><div><span className="stepTag light">TRIP READY</span><h3>{planner.result.name}</h3><p>{planner.result.tripStyle || "Curated Travique journey"}</p></div></div><div className="resultBody"><div className="resultMeta"><span>{durationLabel(planner.result)}</span><span><MapPin size={13}/> Kannur start + return</span></div><div className="resultRouteBig">{planner.result.route?.join(" → ")}</div><div className="resultCards"><div><small>HIGHLIGHTS</small><strong>{(planner.result.highlights||[]).slice(0,4).join(" · ") || "Built route details available on enquiry"}</strong></div><div><small>DISTANCE</small><strong>{planner.result.distance?.approximateTotal||planner.result.distance?.oneWay||"Available on enquiry"}</strong></div></div>{planner.result.itinerary?.length>0&&<div className="itinerary"><div className="subTitle">A GLIMPSE OF THE FLOW</div>{planner.result.itinerary.map((it,i)=><div className="dayRow" key={i}><span>{it[0]}</span><div><strong>{it[1]}</strong><p>{it[2]}</p></div></div>)}</div>} {planner.result.stays?.length>0&&<div className="stayBox"><CalendarDays size={16}/><div><small>STAY PLAN</small><strong>{planner.result.stays.join(" · ")}</strong></div></div>}{formDone?<div className="successBox"><Check size={18}/><div><strong>WhatsApp enquiry opened.</strong><span>Your selected route and details are ready to send.</span></div></div>:<form className="confirmForm" onSubmit={completeWhatsApp}><div className="formHeading"><span className="stepTag">FINAL STEP</span><h4>Make it real.</h4><p>Give the trip maker your details. We’ll send this exact package to WhatsApp.</p></div><div className="formGrid"><label><span>Name</span><input required name="name" placeholder="Your name"/></label><label><span>Contact - 1</span><input required name="contact1" inputMode="tel" placeholder="Primary number"/></label><label><span>Contact - 2</span><input required name="contact2" inputMode="tel" placeholder="Secondary number"/></label><label><span>Place</span><input required name="place" placeholder="Your place"/></label></div><div className="formButtons"><button className="heroPrimary" type="submit">Proceed to WhatsApp <ArrowRight size={16}/></button><button className="ghostBtn" type="button" onClick={resetPlanner}>Plan another trip</button></div></form>}</div></div>}
        </div>
      </section>

      <section className="service" id="service"><div className="serviceVisual"><img src={packages.find(p=>p.destinations.includes("Munnar"))?.image || packages[0].image} alt="Munnar road and hills" loading="lazy"/><div className="routeCard"><span>THE TRIP MAKER</span><strong>PLAN <b>→</b> TRAVEL <b>→</b> REMEMBER</strong></div></div><div className="serviceCopy"><span className="kicker">WHY TRAVIQUE</span><h2>Travel should feel <i>easy.</i></h2><p>The point of the site is not to make you work harder. The planner, route logic and guide do the narrowing so the human conversation starts with a useful trip, not a blank form.</p><div className="benefitList"><div><BusFront/><span><strong>Comfortable travel</strong><small>AC / non-AC options · group journeys</small></span></div><div><ShieldCheck/><span><strong>Planned routes</strong><small>Only published combinations are suggested</small></span></div><div><MapPin/><span><strong>All Kerala service</strong><small>Simple pickup, planning and enquiry flow</small></span></div></div><button className="darkButton" onClick={startPlanner}>Build a trip <ArrowRight size={17}/></button></div></section>

      <section className="socialProof"><div className="sectionHead"><div><span className="kicker">TRAVELLER STORIES</span><h2>The best part is <i>going.</i></h2></div><a className="textLink" href="https://instagram.com/travique_trip_makers" target="_blank" rel="noreferrer">Instagram <span className="igMark">◎</span></a></div><div className="proofGrid"><div className="quoteCard featured"><Sparkles size={17}/><p>“Travel more. Worry less.”</p><span>THE TRAVIQUE PROMISE</span></div><div className="quoteCard"><Star size={16}/><p>Don’t compare 40 cards. Start with one feeling and let the route reveal itself.</p><span>THE NEW WAY TO CHOOSE</span></div><div className="quoteCard photoCard"><img src={featured[2]?.image} alt="Coorg trip" loading="lazy"/><span>GO MAKE A MEMORY</span></div></div></section>
      <section className="cta" id="contact"><div><span className="kicker">YOUR NEXT CHAPTER</span><h2>Where will you<br/><i>go next?</i></h2></div><div className="ctaRight"><p>Have a place in mind — or just a mood? Travique Guide can help you find the right published route.</p><button className="yellowButton" onClick={startPlanner}>Plan my trip <ArrowRight size={17}/></button></div></section>
    </main>
    <footer><div className="footerBrand"><span className="brandIcon">T</span><span className="brandWords"><strong>TRAVIQUE</strong><small>TRIP MAKERS</small></span></div><p>Explore · Travel · Create Memories</p><div className="contacts"><a href="tel:+919633607568">96336 07568</a><a href="tel:+919037188749">90371 88749</a></div></footer>
    <Guide onStartPlanner={startPlanner}/>
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
