import React,{useState} from "react";
import{createRoot}from"react-dom/client";
import{Search,MapPin,ArrowRight,ShieldCheck,Bus,Instagram,Menu,X,ChevronRight,Compass,Sparkles}from"lucide-react";
import"./styles.css";

const trips=[
["Munnar","1 Day","Nature Escape","https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85"],
["Wayanad","1 Day","Nature Escape","https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=85"],
["Mysore + Coorg","2 Days","Weekend","https://images.unsplash.com/photo-1590050752117-238cb0fb5b4c?auto=format&fit=crop&w=1200&q=85"],
["Goa + Dandeli","3 Days","Adventure","https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85"],
["Kashmir","4+ Days","Grand Escape","https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=85"],
["Wonderla","Amusement","Fun Day","https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=85"]
];
const cats=["All Trips","1 Day","2 Days","3 Days","4+ Days","Amusement"];

function App(){
 const[mob,setMob]=useState(false),[cat,setCat]=useState("All Trips"),[search,setSearch]=useState("");
 const filtered=trips.filter(t=>(cat==="All Trips"||t[1]===cat)&&t[0].toLowerCase().includes(search.toLowerCase()));
 const wa="https://wa.me/919633607568";
 return <div className="app">
  <header>
   <a className="brand" href="#"><span className="mark">T</span><span><b>TRAVIQUE</b><small>TRIP MAKERS</small></span></a>
   <nav><a href="#trips">Explore</a><a href="#why">Why Travique</a><a href="#stories">Stories</a><a href="#contact">Contact</a></nav>
   <a className="navCta" href={wa}>Plan a Trip <ArrowRight size={16}/></a>
   <button className="menu" onClick={()=>setMob(!mob)}>{mob?<X/>:<Menu/>}</button>
  </header>
  {mob&&<div className="mobileNav"><a href="#trips">Explore</a><a href="#why">Why Travique</a><a href="#stories">Stories</a><a href="#contact">Contact</a></div>}
  <main>
   <section className="hero">
    <div className="heroImg"/><div className="heroShade"/>
    <div className="heroContent">
     <div className="eyebrow"><span/>GROUP TOURS • ALL KERALA SERVICE</div>
     <h1>Go somewhere<br/><em>worth remembering.</em></h1>
     <p>Curated journeys, comfortable travel and memories that stay with you.</p>
     <div className="searchBox"><Search size={20}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Where do you want to go?"/><button onClick={()=>document.querySelector("#trips").scrollIntoView({behavior:"smooth"})}>Explore <ArrowRight size={16}/></button></div>
     <div className="quick"><span>Popular:</span>{["Munnar","Wayanad","Kashmir","Goa"].map(x=><button key={x} onClick={()=>setSearch(x)}>{x}</button>)}</div>
    </div>
    <div className="heroFloat"><Compass size={17}/><span>TRAVEL MORE<br/><b>WORRY LESS</b></span></div>
   </section>

   <section className="intro">
    <div><span className="kicker">THE TRAVIQUE WAY</span><h2>Not just a trip.<br/><i>It's your story.</i></h2></div>
    <p>From a one-day escape to a long-awaited adventure, we make the journey feel as good as the destination. Choose a package, tell us what you need, and let our trip makers handle the rest.</p>
   </section>

   <section className="trips" id="trips">
    <div className="sectionHead"><div><span className="kicker">EXPLORE</span><h2>Find your next <i>escape.</i></h2></div><a href={wa}>Need a custom trip? <ArrowRight size={16}/></a></div>
    <div className="chips">{cats.map(c=><button className={cat===c?"active":""} onClick={()=>setCat(c)} key={c}>{c}</button>)}</div>
    <div className="grid">{filtered.map((t,i)=><article className="tripCard" key={t[0]} style={{animationDelay:(i*70)+"ms"}}>
     <div className="cardImg"><img src={t[3]} alt={t[0]}/><span>{t[1]}</span><button aria-label="Open trip"><ArrowRight size={18}/></button></div>
     <div className="cardBody"><div><small>{t[2]}</small><h3>{t[0]}</h3></div><ChevronRight size={19}/></div>
    </article>)}</div>
    {!filtered.length&&<div className="empty">No trips found. <a href={wa}>Ask a trip maker →</a></div>}
   </section>

   <section className="experience" id="why">
    <div className="experienceVisual"><img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85" alt="Travel"/>
     <div className="route"><span>YOUR JOURNEY</span><b>PLAN → TRAVEL → REMEMBER</b></div>
    </div>
    <div className="experienceCopy"><span className="kicker">WHY TRAVIQUE</span><h2>Travel should feel <i>effortless.</i></h2>
     <p>Comfortable vehicles, carefully planned group tours and a team that stays with you throughout the journey.</p>
     <div className="benefits">
      <div><Bus/><span><b>Comfortable travel</b><small>AC / non-AC options</small></span></div>
      <div><ShieldCheck/><span><b>Safe & secure</b><small>Trips made with care</small></span></div>
      <div><MapPin/><span><b>All Kerala service</b><small>Easy pickup & planning</small></span></div>
     </div>
     <a className="darkBtn" href={wa}>Talk to a trip maker <ArrowRight size={17}/></a>
    </div>
   </section>

   <section className="stories" id="stories">
    <div className="sectionHead"><div><span className="kicker">TRAVELLER STORIES</span><h2>Come back with <i>stories.</i></h2></div><a href="https://instagram.com/travique_trip_makers" target="_blank">Instagram <Instagram size={16}/></a></div>
    <div className="storyGrid">
     <div className="story large"><img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85" alt="Journey"/><div><Sparkles size={17}/>Collect moments, not just miles.</div></div>
     <div className="story"><img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=85" alt="Group"/><span>GROUP ADVENTURES</span></div>
     <div className="story"><img src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&q=85" alt="Travel"/><span>NEW PLACES</span></div>
    </div>
   </section>

   <section className="cta" id="contact"><div><span className="kicker">YOUR NEXT CHAPTER</span><h2>Where will you<br/><i>go next?</i></h2></div><div><p>Have a destination in mind—or not yet? Tell us what kind of journey you want.</p><a className="lightBtn" href={wa}>Plan my trip <ArrowRight size={17}/></a></div></section>
  </main>
  <footer><div className="brand"><span className="mark">T</span><span><b>TRAVIQUE</b><small>TRIP MAKERS</small></span></div><p>Explore • Travel • Create Memories</p><div><a href="tel:+919633607568">96336 07568</a><a href="tel:+919037188749">90371 88749</a></div></footer>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);