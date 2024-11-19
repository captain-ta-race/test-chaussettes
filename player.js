// Lien vers le flux RSS
const rssFeedUrl = "https://corsproxy.io/?https://feeds.acast.com/public/shows/6728ae32dc854c9577f0ce16"; // Utilise ton flux réel ici
const episodesContainer = document.getElementById("episodes");

// Taille maximale pour le préchargement (3 Mo en octets)
const MAX_PRELOAD_SIZE = 3 * 1024 * 1024;

// Fonction pour récupérer et afficher les épisodes
async function loadPodcastEpisodes() {
    try {
        const response = await fetch(rssFeedUrl);
        if (!response.ok) throw new Error("Erreur lors de la récupération du flux RSS.");
        
        const rssText = await response.text();
        const parser = new DOMParser();
        const rssXml = parser.parseFromString(rssText, "application/xml");

        const items = rssXml.querySelectorAll("item");
        items.forEach(async (item) => {
            const title = item.querySelector("title").textContent;
            const audioUrl = item.querySelector("enclosure")?.getAttribute("url");

            if (audioUrl) {
                // Créer l'élément visuel pour l'épisode
                const episodeDiv = document.createElement("div");
                episodeDiv.classList.add("episode");

                const titleElement = document.createElement("div");
                titleElement.textContent = title;
                titleElement.classList.add("episode-title");

                // Ajout du lecteur audio avec contrôle du préchargement
                const audioElement = document.createElement("audio");
                audioElement.controls = true;

                // Charger seulement 3 Mo via une requête HTTP partielle
                const blobUrl = await fetchPartialAudio(audioUrl, MAX_PRELOAD_SIZE);
                audioElement.src = blobUrl;

                // Ajout au DOM
                episodeDiv.appendChild(titleElement);
                episodeDiv.appendChild(audioElement);
                episodesContainer.appendChild(episodeDiv);
            }
        });
    } catch (error) {
        episodesContainer.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Fonction pour précharger seulement une partie de l'audio
async function fetchPartialAudio(url, maxBytes) {
    const response = await fetch(url, {
        headers: {
            Range: `bytes=0-${maxBytes - 1}`, // Limite la requête aux premiers maxBytes octets
        },
    });

    if (!response.ok) throw new Error("Erreur lors du préchargement de l'audio.");

    const blob = await response.blob();
    return URL.createObjectURL(blob); // Crée un URL Blob pour le lecteur audio
}

// Charger les épisodes au démarrage
loadPodcastEpisodes();
