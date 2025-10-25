const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID"; // replace with your Spotify client ID
const REDIRECT_URI = window.location.href.split('#')[0];
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-top-read";

const loginButton = document.getElementById("login-button");
const statsDiv = document.getElementById("stats");
const topArtistsList = document.getElementById("top-artists");
const topTracksList = document.getElementById("top-tracks");
const shareButton = document.getElementById("share-button");

// Login button redirects to Spotify OAuth
loginButton.addEventListener("click", () => {
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  window.location.href = url;
});

// On load, check if token exists in URL
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.replace("#", "?"));
    const token = params.get("access_token");
    if (token) {
      loginButton.style.display = "none";
      statsDiv.classList.remove("hidden");
      shareButton.classList.remove("hidden");
      fetchTopArtists(token);
      fetchTopTracks(token);
    }
  }
});

// Fetch top artists
function fetchTopArtists(token) {
  fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    topArtistsList.innerHTML = "";
    data.items.forEach((artist, i) => {
      topArtistsList.innerHTML += `<li>#${i+1} ${artist.name}</li>`;
    });
  });
}

// Fetch top tracks
function fetchTopTracks(token) {
  fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    topTracksList.innerHTML = "";
    data.items.forEach((track, i) => {
      topTracksList.innerHTML += `<li>#${i+1} ${track.name} by ${track.artists[0].name}</li>`;
    });
  });
}

// Optional: share button
shareButton.addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({
      title: "My Spotify Wrapped (Anytime)",
      text: "Check out my Spotify Wrapped!",
      url: window.location.href
    });
  } else {
    alert("Sharing not supported on this device.");
  }
});
