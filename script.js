const CLIENT_ID = "81b29ad7ea324719b369cd7ac9b2e080";
const REDIRECT_URI = "https://thisihate03-boop.github.io/my-spotify-wrapped/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-top-read";

const loginButton = document.getElementById("login-button");
const statsDiv = document.getElementById("stats");
const topArtistsList = document.getElementById("top-artists");
const topTracksList = document.getElementById("top-tracks");
const shareButton = document.getElementById("share-button");

// --- LOGIN HANDLER ---
loginButton.addEventListener("click", () => {
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
  window.location.href = url;
});

// --- GET TOKEN FROM HASH OR LOCALSTORAGE ---
window.addEventListener("load", () => {
  let token = localStorage.getItem("spotify_token");

  // if token isn't saved but hash exists
  if (!token && window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    token = params.get("access_token");

    if (token) {
      localStorage.setItem("spotify_token", token);
      window.location.hash = ""; // clean URL
    }
  }

  if (token) {
    loginButton.style.display = "none";
    statsDiv.classList.remove("hidden");
    shareButton.classList.remove("hidden");
    fetchTopArtists(token);
    fetchTopTracks(token);
  } else {
    console.log("No token found. Please log in.");
  }
});

// --- FETCH TOP ARTISTS ---
function fetchTopArtists(token) {
  fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      topArtistsList.innerHTML = "";
      if (data.items && data.items.length > 0) {
        data.items.forEach((artist, i) => {
          topArtistsList.innerHTML += `<li>#${i + 1} ${artist.name}</li>`;
        });
      } else {
        topArtistsList.innerHTML = "<li>No data found 😔</li>";
      }
    })
    .catch((err) => console.error("Error fetching artists:", err));
}

// --- FETCH TOP TRACKS ---
function fetchTopTracks(token) {
  fetch("https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      topTracksList.innerHTML = "";
      if (data.items && data.items.length > 0) {
        data.items.forEach((track, i) => {
          topTracksList.innerHTML += `<li>#${i + 1} ${track.name} by ${track.artists[0].name}</li>`;
        });
      } else {
        topTracksList.innerHTML = "<li>No data found 😔</li>";
      }
    })
    .catch((err) => console.error("Error fetching tracks:", err));
}

// --- SHARE BUTTON ---
shareButton.addEventListener("click", () => {
  if (navigator.share) {
    navigator.share({
      title: "My Spotify Wrapped (Anytime)",
      text: "Check out my Spotify Wrapped!",
      url: REDIRECT_URI,
    });
  } else {
    alert("Sharing not supported on this device.");
  }
});