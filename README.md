
# 🚑 RESQROUTE-AI  
**Domain:** Emergency Services / Public Welfare  
**Tagline:** Saving time, saving lives.  

Issues | Forks | Stars  



## 🧠 Overview  
RESQROUTE-AI is a smart, offline-first application designed to help users quickly locate the nearest essential services, such as hospitals, police stations, petrol pumps, and puncture shops. Unlike Google Maps, which requires large downloads or constant internet connectivity, RESQROUTE-AI leverages **GPS and local POI data** to deliver instant results even offline.  

For ambulances, RESQROUTE-AI goes a step further: it calculates the **shortest path to the nearest hospital**, factoring in **traffic light predictions** to avoid congested routes and reduce critical response times.  





## 🚨 Problem Addressed  
Emergency response and everyday navigation often suffer due to:  
- Dependence on internet connectivity for maps  
- Lack of lightweight offline solutions  
- No predictive routing for ambulances in traffic-heavy zones  

RESQROUTE-AI solves these by combining **offline maps, POI databases, and intelligent routing algorithms**.  



## ✨ Features  

### 🧍 Citizens  
- 📍 **Nearest Services:** Find hospitals, police stations, petrol pumps, and puncture shops using GPS  
- 📞 **Contact Info:** Get direct phone numbers of nearby services  
- 📋 **Offline Access:** Works without internet, using locally stored POIs  

### 🚑 Ambulance Drivers  
- 🗺️ **Shortest Path:** Navigate to the nearest hospital with optimized routing  
- 🚦 **Traffic Light Prediction:** Avoid red-light heavy roads, prioritize green-light paths  
- ⏱️ **Reduced Response Time:** Faster navigation during emergencies  


## 📘 Technical Highlights  
- 🗂️ **SQLite POI Database:** Stores essential services locally  
- 📡 **GPS Integration:** Matches user location with nearest POIs  
- 🔄 **Haversine Formula:** Accurate nearest-neighbor search for distances  
- 🗺️ **Offline Map Tiles:** Optional region-based downloads for map visualization  
- 🔧 **Fallback Mode:** List-only view when maps aren’t downloaded  



## 📂 Project Structure  

```
RESQROUTE-AI/
├── backend/              # Node.js/Express backend for POI management
│   ├── config/           # Database configs (SQLite/OSM extraction)
│   ├── controllers/      # Business logic for POI queries
│   ├── routes/           # API endpoints (e.g., /nearest, /ambulance-route)
│   └── server.js         # Backend entry point
│
├── public/               # Static assets
│   ├── tiles/            # Offline map tiles (region-based)
│   └── icons/            # Service icons (hospital, police, petrol, etc.)
│
├── src/                  # React Native / Android frontend
│   ├── Pages/            # Citizen view, Ambulance view
│   ├── components/       # Map renderer, POI list, routing UI
│   ├── utils/            # Haversine formula, traffic prediction logic
│   └── App.jsx           # Main app entry point
│
├── LICENSE               # Open-source license
├── README.md             # This file
└── package.json          # Dependencies and scripts
```



## 🎉 Highlights  
- 🚦 **Traffic-Aware Ambulance Routing**  
- 📞 **Direct Contact Numbers for Services**  
- 🗺️ **Offline-first Design**  
- 🔒 **Lightweight & Secure**  

.
