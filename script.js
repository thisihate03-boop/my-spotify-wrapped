// ==== Spotify Config ====
const CLIENT_ID = "81b29ad7ea324719b369cd7ac9b2e080"; // your Spotify Client ID
const REDIRECT_URI = "https://thisihate03-boop.github.io/my-spotify-wrapped/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-top-read";

// ==== DOM Elements ====
const loginButton = document.getElementById("login-button");
const statsDiv = document.getElementById("stats");
const topArtistsList = document.getElementById("top-artists");
const topTracksList = document.getElementById("top-tracks");
const shareButton = document.getElementById("share-button");

// ==== Login Handler ====
loginButton.addEventListener("click", () => {
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
  window.location.href = url;
});

// ==== On Page Load ====
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash && hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    console.log("Spotify token:", token);

    if (token) {
      loginButton.style.display = "none";
      statsDiv.classList.remove("hidden");
      shareButton.classList.remove("hidden");

      fetchTopArtists(token);
      fetchTopTracks(token);
    }
  } else {
    console.log("No token found — please log in again.");
  }
});

// ==== Fetch Top Artists ====
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

// ==== Fetch Top Tracks ====
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

// ==== Share Button ====
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