// Lien vers le flux RSS
const rssFeedUrl = "https://corsproxy.io/?https://feeds.acast.com/public/shows/6728ae32dc854c9577f0ce16";

// Récupérer et traiter le flux RSS
async function loadPodcastEpisodes() {
    try {
        const response = await fetch(rssFeedUrl);
        if (!response.ok) throw new Error("Erreur lors de la récupération du flux RSS.");
        
        const rssText = await response.text();
        // Suite du traitement (parser XML)...
    } catch (error) {
        console.error("Erreur :", error.message);
    }
}

// Récupération des éléments HTML
const episodesContainer = document.getElementById("episodes");

// Fonction pour récupérer et traiter le flux RSS
async function loadPodcastEpisodes() {
    try {
        const response = await fetch(rssFeedUrl);
        if (!response.ok) throw new Error("Erreur lors de la récupération du flux RSS.");
        
        const rssText = await response.text();
        const parser = new DOMParser();
        const rssXml = parser.parseFromString(rssText, "application/xml");

        // Parcours des items (épisodes)
        const items = rssXml.querySelectorAll("item");
        items.forEach((item, index) => {
            const title = item.querySelector("title").textContent;
            const audioUrl = item.querySelector("enclosure")?.getAttribute("url");

            if (audioUrl) {
                // Création d'une section pour chaque épisode
                const episodeDiv = document.createElement("div");
                episodeDiv.classList.add("episode");

                // Titre de l'épisode
                const titleElement = document.createElement("div");
                titleElement.textContent = title;
                titleElement.classList.add("episode-title");
                titleElement.onclick = () => playAudio(audioUrl);

                // Player audio
                const audioElement = document.createElement("audio");
                audioElement.controls = true;
                audioElement.src = audioUrl;

                // Ajout des éléments au DOM
                episodeDiv.appendChild(titleElement);
                episodeDiv.appendChild(audioElement);
                episodesContainer.appendChild(episodeDiv);
            }
        });
    } catch (error) {
        episodesContainer.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Fonction pour jouer un épisode (facultatif si autoplay est désiré)
function playAudio(url) {
    const allAudioElements = document.querySelectorAll("audio");
    allAudioElements.forEach(audio => audio.pause()); // Pause les autres players
    const targetAudio = [...allAudioElements].find(audio => audio.src === url);
    if (targetAudio) targetAudio.play();
}

// Charger les épisodes au chargement de la page
loadPodcastEpisodes();
