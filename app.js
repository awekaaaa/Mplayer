// =================================================================
// LANGKAH PENTING: URL ANDA TETAP SAMA
// =================================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbxVe4cDHxJ0FjmD4hcafufyGnPWjx75_n5OYTQENWgEhKffjuTkBSoWyY-CgOustyHosg/exec';
// =================================================================

// Registrasi Service Worker (tidak berubah)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker terdaftar!', reg))
        .catch(err => console.error('Gagal mendaftarkan Service Worker:', err));
}

// Elemen DOM dan variabel state (tidak berubah)
const audioPlayer = document.getElementById('audio-player');
const playlistElement = document.getElementById('playlist');
// ... (sisa variabel Anda sama)
const currentTrackElement = document.getElementById('current-track');
const artistNameElement = document.getElementById('artist-name');
let playlistItems = [];
let currentTrackIndex = -1;
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let audioContext, analyser, isVisualizerInitialized = false;

// === PERUBAHAN UTAMA: MENGGUNAKAN JSONP ===

// Ini adalah fungsi yang akan dipanggil oleh server Google
function loadPlaylist(result) {
    if (result.success) {
        playlistItems = result.data;
        displayInitialPlaylist();
    } else {
        showError(result.error);
    }
}

// Fungsi ini sekarang membuat tag <script> secara dinamis
function fetchAndDisplayPlaylist() {
    const script = document.createElement('script');
    // Menambahkan parameter ?callback=loadPlaylist ke URL API
    script.src = `${API_URL}?callback=loadPlaylist`;
    script.onerror = () => {
        showError('Gagal memuat skrip API. Cek URL API atau blokiran jaringan.');
    };
    document.body.appendChild(script);
}

// === SISA KODE ANDA TIDAK BERUBAH SAMA SEKALI ===

function displayInitialPlaylist() { /* ... (kode Anda dari sebelumnya) ... */ }
function playTrack(index) { /* ... (kode Anda dari sebelumnya) ... */ }
async function downloadTrackForOffline(event) { /* ... (kode Anda dari sebelumnya) ... */ }
async function checkCachedTracks() { /* ... (kode Anda dari sebelumnya) ... */ }
function setupAudioVisualizer() { /* ... (kode Anda dari sebelumnya) ... */ }
function renderRadialFrame() { /* ... (kode Anda dari sebelumnya) ... */ }
function cleanAndSeparateTitle(fileName) { /* ... (kode Anda dari sebelumnya) ... */ }
function updateActiveTrack() { /* ... (kode Anda dari sebelumnya) ... */ }
function showError(message) { /* ... (kode Anda dari sebelumnya) ... */ }
audioPlayer.addEventListener("ended", () => { /* ... (kode Anda dari sebelumnya) ... */ });

// Menempelkan kembali semua fungsi yang tidak berubah
function displayInitialPlaylist(){playlistElement.innerHTML="";playlistItems.forEach((file,index)=>{const item=document.createElement("div");item.className="playlist-item";item.dataset.index=index;item.onclick=e=>{if(e.target.tagName!=="BUTTON"){playTrack(index)}};const{artist,title}=cleanAndSeparateTitle(file.name);item.innerHTML=`<div class="track-info"><span class="track-title">${title}</span><span class="track-subtitle">${artist}</span></div> <button class="download-btn" data-id="${file.id}">Offline</button>`;playlistElement.appendChild(item)});document.querySelectorAll(".download-btn").forEach(button=>{button.onclick=downloadTrackForOffline});checkCachedTracks()}
function playTrack(index){if(index<0||index>=playlistItems.length)return;if(!isVisualizerInitialized){setupAudioVisualizer()}
currentTrackIndex=index;const track=playlistItems[index];const{artist,title}=cleanAndSeparateTitle(track.name);currentTrackElement.textContent=title;artistNameElement.textContent=artist;audioPlayer.src=`https://drive.google.com/uc?export=download&id=${track.id}`;audioPlayer.play();updateActiveTrack()}
async function downloadTrackForOffline(event){const button=event.target;const id=button.dataset.id;button.textContent="...";button.disabled=true;try{const cache=await caches.open("audio-cache");await cache.add(`https://drive.google.com/uc?export=download&id=${id}`);button.textContent="✔ Offline";button.classList.add("downloaded")}catch(err){console.error("Gagal men-cache lagu:",err);button.textContent="Gagal";button.disabled=false}}
async function checkCachedTracks(){const cache=await caches.open("audio-cache");const cachedRequests=await cache.keys();const cachedIds=cachedRequests.map(req=>new URL(req.url).searchParams.get("id"));document.querySelectorAll(".download-btn").forEach(button=>{if(cachedIds.includes(button.dataset.id)){button.textContent="✔ Offline";button.classList.add("downloaded");button.disabled=true}})}
function setupAudioVisualizer(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;audioContext=new AudioContext();const source=audioContext.createMediaElementSource(audioPlayer);analyser=audioContext.createAnalyser();source.connect(analyser);analyser.connect(audioContext.destination);analyser.fftSize=256;isVisualizerInitialized=true;renderRadialFrame()}
function renderRadialFrame(){const bufferLength=analyser.frequencyBinCount;const dataArray=new Uint8Array(bufferLength);analyser.getByteFrequencyData(dataArray);let sum=0;for(let i=0;i<bufferLength;i++){sum+=dataArray[i]}
const average=sum/bufferLength;ctx.clearRect(0,0,canvas.width,canvas.height);const centerX=canvas.width/2;const centerY=canvas.height/2;const baseRadius=30;const pulseFactor=average/255;const maxPulse=60;ctx.beginPath();ctx.arc(centerX,centerY,baseRadius+(pulseFactor*maxPulse*1.2),0,2*Math.PI);ctx.strokeStyle="rgba(168,251,211,0.2)";ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(centerX,centerY,baseRadius+(pulseFactor*maxPulse*0.8),0,2*Math.PI);ctx.strokeStyle="rgba(168,251,211,0.4)";ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.arc(centerX,centerY,baseRadius+(pulseFactor*maxPulse*0.5),0,2*Math.PI);ctx.fillStyle="rgba(168,251,211,0.9)";ctx.fill();requestAnimationFrame(renderRadialFrame)}
function cleanAndSeparateTitle(fileName){let cleanName=fileName.replace(/\.(mp3|m4a|wav)$/i,"").replace(/\[[\w-]{11}\]$/,"").trim();const parts=cleanName.split(" - ");if(parts.length>1){return{artist:parts[0].trim(),title:parts.slice(1).join(" - ").trim()}}
return{artist:"Unknown Artist",title:cleanName}}
function updateActiveTrack(){const allItems=document.querySelectorAll(".playlist-item");allItems.forEach((item,idx)=>item.classList.toggle("active",idx==currentTrackIndex))}
function showError(message){playlistElement.innerHTML=`<div class="loader">${message}</div>`}
audioPlayer.addEventListener("ended",()=>{if(playlistItems.length>0){const nextIndex=(currentTrackIndex+1)%playlistItems.length;playTrack(nextIndex)}});


// Memulai aplikasi dengan memanggil fungsi JSONP
fetchAndDisplayPlaylist();