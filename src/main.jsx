import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, BusFront, CalendarDays, Check, ChevronRight, Clock3, Compass,
  Instagram, MapPin, Menu, MessageCircle, Search, ShieldCheck, Sparkles, Star, X
} from "lucide-react";
import "./styles.css";

const WA = "https://wa.me/919633607568";

const trips = [
  { name: "Munnar", days: "1 Day", type: "Nature", place: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=88", copy: "Tea country, viewpoints and a refreshing day in the hills." },
  { name: "Wagamon", days: "1 Day", type: "Nature", place: "Kerala", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88", copy: "Green valleys, misty hills and a slow scenic escape." },
  { name: "Kodaikanal", days: "1 Day", type: "Nature", place: "Tamil Nadu", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88", copy: "A cool-weather classic with lakes, hills and viewpoints." },
  { name: "Ooty", days: "1 Day", type: "Nature", place: "Tamil Nadu", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=88", copy: "Mountain roads, tea estates and a full day of Nilgiri views." },
  { name: "Mysore", days: "1 Day", type: "City Escape", place: "Karnataka", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=88", copy: "Palaces, local flavour and a relaxed cultural day out." },
  { name: "Athirappally + Vazhachal", days: "1 Day", type: "Waterfalls", place: "Kerala", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=88", copy: "Waterfalls, forest roads and one of Kerala's iconic day escapes." },
  { name: "Alappuzha", days: "1 Day", type: "Backwaters", place: "Kerala", image: "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1200&q=88", copy: "Backwaters, breeze and an easy-going Kerala experience." },
  { name: "Ernakulam + Cruise Ship", days: "1 Day", type: "City + Cruise", place: "Kerala", image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1200&q=88", copy: "City time paired with a cruise experience." },
  { name: "Kumarakom", days: "1 Day", type: "Backwaters", place: "Kerala", image: "https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=88", copy: "Peaceful waters, palms and a quieter backwater day." },
  { name: "Nelliyampathy", days: "1 Day", type: "Hills", place: "Kerala", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88", copy: "Curvy hill roads and panoramic views for a scenic reset." },
  { name: "Valparai", days: "1 Day", type: "Hills", place: "Tamil Nadu", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=88", copy: "Tea estates, forest roads and an immersive mountain drive." },
  { name: "Wayanad", days: "1 Day", type: "Nature", place: "Kerala", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=88", copy: "A green getaway with waterfalls, viewpoints and adventure." },

  { name: "Mysore + Coorg", days: "2 Days", type: "Weekend", place: "Karnataka", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88", copy: "A compact weekend pairing two iconic Karnataka escapes." },
  { name: "Mysore + Bangalore", days: "2 Days", type: "Weekend", place: "Karnataka", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=88", copy: "Culture and city energy packed into one smooth short break." },
  { name: "Mysore + Chikmagalur", days: "2 Days", type: "Weekend", place: "Karnataka", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=88", copy: "Palace mornings followed by cool hill-country views." },
  { name: "Mysore + Bangalore + Wonderla", days: "2 Days", type: "Family Fun", place: "Karnataka", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=88", copy: "Sightseeing and theme-park fun in a high-energy weekend." },
  { name: "Mysore + Ooty", days: "2 Days", type: "Hill + City", place: "South India", image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=88", copy: "From royal Mysore to cool Nilgiri mornings." },
  { name: "Chikmagalur + Udupi", days: "2 Days", type: "Coastal + Hills", place: "Karnataka", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88", copy: "Hill country and the coast in one curated route." },
  { name: "Dandeli + Chikmagalur", days: "2 Days", type: "Adventure", place: "Karnataka", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=88", copy: "Adventure first, then a cool hill-town reset." },
  { name: "Chikmagalur + Belur", days: "2 Days", type: "Heritage", place: "Karnataka", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=88", copy: "Coffee-country scenery with a heritage detour." },
  { name: "Hampi", days: "2 Days", type: "Heritage", place: "Karnataka", image: "https://images.unsplash.com/photo-1524492412937-b28074a5dba5?auto=format&fit=crop&w=1200&q=88", copy: "History, boulders and unforgettable golden-hour landscapes." },
  { name: "Yercaud + Hogenakkal", days: "2 Days", type: "Nature", place: "Tamil Nadu", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=88", copy: "A refreshing hill escape with a dramatic waterfall stop." },
  { name: "Yercaud + Bangalore", days: "2 Days", type: "Weekend", place: "South India", image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=88", copy: "A flexible short break blending hills and city life." },

  { name: "Udupi + Goa + Dandeli", days: "3 Days", type: "Adventure", place: "South India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=88", copy: "Coast, nightlife and adventure across three memorable stops." },
  { name: "Goa + Dandeli", days: "3 Days", type: "Adventure", place: "Goa + Karnataka", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=88", copy: "Beach time meets river adventure and lush forests." },
  { name: "Gokarna", days: "3 Days", type: "Coastal", place: "Karnataka", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=88", copy: "Beaches, sunsets and a slower coastal rhythm." },
  { name: "Murudeshwar", days: "3 Days", type: "Coastal", place: "Karnataka", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=88", copy: "A relaxed coastal journey with iconic seafront views." },
  { name: "Hyderabad", days: "3 Days", type: "City Escape", place: "Telangana", image: "https://images.unsplash.com/photo-1524492412937-b28074a5dba5?auto=format&fit=crop&w=1200&q=88", copy: "Explore a vibrant city by bus, train or flight options." },

  { name: "Delhi + Agra", days: "4+ Days", type: "Grand Escape", place: "North India", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=88", copy: "A classic North India journey with the Taj and capital city." },
  { name: "Manali + Delhi + Agra", days: "4+ Days", type: "Grand Escape", place: "North India", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=88", copy: "Mountains, a capital-city stop and the Taj in one long escape." },
  { name: "Kashmir", days: "4+ Days", type: "Grand Escape", place: "North India", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=88", copy: "A cinematic mountain journey through Kashmir's landscapes." },
  { name: "Jaisalmer", days: "4+ Days", type: "Grand Escape", place: "Rajasthan", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=88", copy: "Golden forts, desert horizons and a very different India." },

  { name: "Wonderla", days: "Amusement", type: "Theme Park", place: "Kochi • Bangalore • Hyderabad", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=88", copy: "Full-day theme-park fun with group travel planned around you." },
  { name: "Silver Storm", days: "Amusement", type: "Theme Park", place: "Kerala", image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1200&q=88", copy: "A fun-packed day for groups, families and friends." },
  { name: "Dream World", days: "Amusement", type: "Theme Park", place: "Kerala", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88", copy: "Easy group travel to a full day of rides and memories." },
  { name: "GRS Fantasy Park", days: "Amusement", type: "Theme Park", place: "Mysore", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=88", copy: "A day out built around rides, water and group fun." },
  { name: "Fantasy Park", days: "Amusement", type: "Theme Park", place: "Palakkad", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88", copy: "An easy escape for school, friends and family groups." },
  { name: "Snow World", days: "Amusement", type: "Theme Park", place: "Hyderabad", image: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200&q=88", copy: "A cool indoor experience for a different kind of day out." },
];

const cats = ["All Trips", "1 Day", "2 Days", "3 Days", "4+ Days", "Amusement"];

const details = {
  "1 Day": ["One-day group trip", "Comfort-focused travel", "Pickup and planning support"],
  "2 Days": ["Short multi-day escape", "Stay + sightseeing planning", "Group travel coordination"],
  "3 Days": ["Curated 3-day route", "Travel + stay planning", "Flexible transport options"],
  "4+ Days": ["Long-format holiday", "Route-led itinerary", "Trip maker support throughout"],
  "Amusement": ["Theme-park day plan", "Group travel coordination", "Easy enquiry & booking support"],
};

function App() {
  const [menu, setMenu] = useState(false);
  const [cat, setCat] = useState("All Trips");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trips.filter((t) => {
      const matchesCat = cat === "All Trips" || t.days === cat;
      const haystack = `${t.name} ${t.type} ${t.place}`.toLowerCase();
      return matchesCat && (!q || haystack.includes(q));
    });
  }, [cat, search]);

  const openWhatsApp = (trip) => {
    const message = trip ? `Hi Travique Trip Makers, I want to know more about the ${trip.name} ${trip.days} package.` : "Hi Travique Trip Makers, I want to plan a trip.";
    window.open(`${WA}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#top" onClick={() => setMenu(false)}>
          <span className="brandIcon">T</span>
          <span className="brandWords"><strong>TRAVIQUE</strong><small>TRIP MAKERS</small></span>
        </a>
        <nav>
          <a href="#trips">Packages</a>
          <a href="#story">Our way</a>
          <a href="#service">Why us</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="headerCta" onClick={() => openWhatsApp()}>
          Plan a Trip <ArrowRight size={16} />
        </button>
        <button className="menuBtn" onClick={() => setMenu(!menu)} aria-label="Open menu">{menu ? <X /> : <Menu />}</button>
      </header>

      {menu && <div className="mobileNav">
        <a href="#trips" onClick={() => setMenu(false)}>Packages</a>
        <a href="#story" onClick={() => setMenu(false)}>Our way</a>
        <a href="#service" onClick={() => setMenu(false)}>Why us</a>
        <a href="#contact" onClick={() => setMenu(false)}>Contact</a>
      </div>}

      <main id="top">
        <section className="hero">
          <div className="heroPhoto" />
          <div className="heroOverlay" />
          <div className="heroContent">
            <div className="eyebrow"><span /> GROUP TOURS • ALL KERALA SERVICE</div>
            <div className="heroPill"><Compass size={15} /> CURATED BY TRAVIQUE</div>
            <h1>Go somewhere<br /><em>worth remembering.</em></h1>
            <p>Trips built around the way you actually want to travel — comfortable, simple and full of places worth talking about later.</p>
            <div className="searchBox">
              <Search size={20} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Munnar, Kashmir, Wonderla…" />
              <button onClick={() => document.querySelector("#trips")?.scrollIntoView({ behavior: "smooth" })}>Explore <ArrowRight size={16} /></button>
            </div>
            <div className="quickSearch"><span>Popular</span>{["Munnar", "Wayanad", "Kashmir", "Wonderla"].map((x) => <button key={x} onClick={() => setSearch(x)}>{x}</button>)}</div>
          </div>
          <div className="heroCard">
            <small>NEXT DEPARTURE</small>
            <strong>Pick your place.</strong>
            <span>We'll take care of the rest.</span>
            <button onClick={() => openWhatsApp()}>Talk to a trip maker <MessageCircle size={15} /></button>
          </div>
          <div className="heroFoot">
            <span><Check size={14} /> Group tours</span>
            <span><Check size={14} /> AC / non-AC</span>
            <span><Check size={14} /> All Kerala service</span>
          </div>
        </section>

        <section className="manifesto" id="story">
          <div className="manifestoTitle"><span className="kicker">THE TRAVIQUE WAY</span><h2>Not just a trip.<br /><i>It's your story.</i></h2></div>
          <div className="manifestoText">
            <p>From a one-day escape to a long-awaited adventure, our packages are designed to keep the planning simple and the experience memorable.</p>
            <div className="miniStats"><div><strong>30+</strong><span>destinations</span></div><div><strong>5</strong><span>trip formats</span></div><div><strong>1</strong><span>team to call</span></div></div>
          </div>
        </section>

        <section className="packageSection" id="trips">
          <div className="sectionHead">
            <div><span className="kicker">EXPLORE PACKAGES</span><h2>Find your next <i>escape.</i></h2></div>
            <button className="textLink" onClick={() => openWhatsApp()}>Need a custom trip? <ArrowRight size={16} /></button>
          </div>
          <div className="filters">{cats.map((c) => <button key={c} className={cat === c ? "active" : ""} onClick={() => setCat(c)}>{c}</button>)}</div>
          <div className="resultsLine"><span>{filtered.length} packages</span><span>Scroll. Pick. Enquire.</span></div>

          <div className="tripGrid">
            {filtered.map((t, i) => (
              <article className="tripCard" key={t.name + t.days} style={{ "--delay": `${i * 35}ms` }}>
                <button className="tripImage" onClick={() => setSelected(t)} aria-label={`View ${t.name}`}>
                  <img src={t.image} alt={t.name} loading="lazy" />
                  <span className="dayBadge">{t.days}</span>
                  <span className="roundArrow"><ArrowRight size={17} /></span>
                  <span className="imageShade" />
                  <span className="viewLabel">VIEW PACKAGE</span>
                </button>
                <div className="tripInfo">
                  <div>
                    <small>{t.type} · {t.place}</small>
                    <h3>{t.name}</h3>
                  </div>
                  <button className="tinyBtn" onClick={() => openWhatsApp(t)} aria-label={`Enquire about ${t.name}`}><MessageCircle size={17} /></button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="emptyState"><Search size={20} /><strong>No package found</strong><span>Try another place or ask a trip maker directly.</span><button onClick={() => openWhatsApp()}>Ask Travique <ArrowRight size={15} /></button></div>}
        </section>

        <section className="service" id="service">
          <div className="serviceVisual">
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=88" alt="Road through green hills" loading="lazy" />
            <div className="routeCard"><span>YOUR JOURNEY</span><strong>PLAN <b>→</b> TRAVEL <b>→</b> REMEMBER</strong></div>
          </div>
          <div className="serviceCopy">
            <span className="kicker">WHY TRAVIQUE</span>
            <h2>Travel should feel <i>effortless.</i></h2>
            <p>We handle the route, group coordination and travel details so your energy stays where it should: on the journey.</p>
            <div className="benefitList">
              <div><BusFront /><span><strong>Comfortable travel</strong><small>AC / non-AC options · Pushback · buses</small></span></div>
              <div><ShieldCheck /><span><strong>Safe & secure</strong><small>Planned group journeys with support</small></span></div>
              <div><MapPin /><span><strong>All Kerala service</strong><small>Pickup, planning and easy enquiry</small></span></div>
            </div>
            <button className="darkButton" onClick={() => openWhatsApp()}>Talk to a trip maker <ArrowRight size={17} /></button>
          </div>
        </section>

        <section className="socialProof">
          <div className="sectionHead"><div><span className="kicker">TRAVELLER STORIES</span><h2>Come back with <i>stories.</i></h2></div><a className="textLink" href="https://instagram.com/travique_trip_makers" target="_blank" rel="noreferrer">Instagram <Instagram size={16} /></a></div>
          <div className="proofGrid">
            <div className="quoteCard featured"><Sparkles size={17} /><p>“Travel more. Worry less.”</p><span>THE TRAVIQUE PROMISE</span></div>
            <div className="quoteCard"><Star size={16} /><p>Built for groups, families and friends who just want the trip to feel easy.</p><span>GROUP TOURS</span></div>
            <div className="quoteCard photoCard"><img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=88" alt="Friends travelling together" loading="lazy" /><span>MAKE MEMORIES</span></div>
          </div>
        </section>

        <section className="cta" id="contact">
          <div><span className="kicker">YOUR NEXT CHAPTER</span><h2>Where will you<br /><i>go next?</i></h2></div>
          <div className="ctaRight"><p>Have a destination in mind — or only a mood? Tell us what kind of journey you want.</p><button className="yellowButton" onClick={() => openWhatsApp()}>Plan my trip <ArrowRight size={17} /></button></div>
        </section>
      </main>

      <footer>
        <div className="footerBrand"><span className="brandIcon">T</span><span className="brandWords"><strong>TRAVIQUE</strong><small>TRIP MAKERS</small></span></div>
        <p>Explore · Travel · Create Memories</p>
        <div className="contacts"><a href="tel:+919633607568">96336 07568</a><a href="tel:+919037188749">90371 88749</a></div>
      </footer>

      {selected && <div className="modalBackdrop" onClick={() => setSelected(null)}>
        <div className="packageModal" onClick={(e) => e.stopPropagation()}>
          <button className="modalClose" onClick={() => setSelected(null)} aria-label="Close"><X size={20} /></button>
          <img src={selected.image} alt={selected.name} />
          <div className="modalBody">
            <div className="modalMeta"><span>{selected.days}</span><span>{selected.type}</span><span><MapPin size={13} /> {selected.place}</span></div>
            <h3>{selected.name}</h3>
            <p>{selected.copy}</p>
            <div className="detailGrid">{details[selected.days].map((x) => <div key={x}><Check size={15} /> {x}</div>)}</div>
            <div className="modalNote"><CalendarDays size={17} /><span>Dates and fare vary by departure. Enquire with Travique for the current plan.</span></div>
            <button className="modalCta" onClick={() => openWhatsApp(selected)}>Enquire on WhatsApp <ArrowRight size={17} /></button>
          </div>
        </div>
      </div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
