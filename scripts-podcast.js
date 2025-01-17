// Récupérer le titre du podcast depuis les paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const podcastTitle = decodeURIComponent(urlParams.get("title")); // Titre du podcast
const episodesContainer = document.getElementById("podcast-info");

// Taille maximale pour le préchargement (3 Mo en octets)
const MAX_PRELOAD_SIZE = 3 * 1024 * 1024;

// Fonction principale pour charger et afficher les épisodes
async function loadPodcastEpisodes() {
    try {
        // Charger le fichier podcasts.json pour récupérer l'URL du flux RSS
        const response = await fetch("podcasts.json");
        if (!response.ok) throw new Error("Impossible de charger les informations du podcast.");
        const podcasts = await response.json();

        // Trouver le podcast correspondant
        const podcast = podcasts.find(p => p.title.toLowerCase() === podcastTitle.toLowerCase());
        if (!podcast) throw new Error("Podcast non trouvé.");

        // Mettre à jour le titre de la page
        document.getElementById("podcast-title").textContent = podcast.title;

        // Récupérer les 25 derniers épisodes depuis le flux RSS
        const feedResponse = await fetch(podcast.rss);
        if (!feedResponse.ok) throw new Error("Impossible de récupérer le flux RSS.");
        const feedText = await feedResponse.text();

        // Parser le flux RSS
        const parser = new DOMParser();
        const rssXml = parser.parseFromString(feedText, "application/xml");

        const items = Array.from(rssXml.querySelectorAll("item")).slice(0, 25);

        if (items.length === 0) {
            episodesContainer.innerHTML = `<p>Aucun épisode disponible.</p>`;
            return;
        }

        // Effacer le contenu précédent
        episodesContainer.innerHTML = "";

        // Afficher chaque épisode
        for (const item of items) {
            const title = item.querySelector("title").textContent;
            const audioUrl = item.querySelector("enclosure")?.getAttribute("url");
            const description = item.querySelector("description")?.textContent || "Pas de description.";
            const pubDate = item.querySelector("pubDate")?.textContent;

            if (audioUrl) {
                // Précharger les 3 Mo initiaux de l'épisode
                const preloadUrl = await prefetchAudio(audioUrl);

                // Ajouter l'épisode à la page
                episodesContainer.innerHTML += `
                    <div class="episode">
                        <h3>${title}</h3>
                        <p>${new Date(pubDate).toLocaleDateString()} - ${description}</p>
                        <audio controls src="${preloadUrl || audioUrl}"></audio>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des épisodes :", error.message);
        episodesContainer.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Fonction pour précharger une partie du fichier audio
async function prefetchAudio(url) {
    try {
        const response = await fetch(url, {
            headers: {
                Range: `bytes=0-${MAX_PRELOAD_SIZE - 1}`, // Précharger 3 Mo
            },
        });

        if (!response.ok) throw new Error(`Préchargement échoué pour ${url}.`);

        const blob = await response.blob();
        return URL.createObjectURL(blob); // Crée une URL Blob pour le player
    } catch (error) {
        console.warn(`Erreur lors du préchargement de ${url}:`, error.message);
        return null; // Revenir à l'URL originale en cas d'échec
    }
}

// Charger les épisodes au chargement de la page
loadPodcastEpisodes();

async function loadPodcastEpisodes() {
    try {
        console.log("Fetching podcasts.json...");
        const response = await fetch("podcasts.json");
        if (!response.ok) throw new Error("Failed to load podcasts.json.");

        const podcasts = await response.json();
        const podcast = podcasts.find(p => p.title.toLowerCase() === podcastTitle.toLowerCase());
        if (!podcast) throw new Error("Podcast not found.");

        console.log("Fetching RSS feed:", podcast.rss);
        const feedResponse = await fetch(podcast.rss);
        if (!feedResponse.ok) throw new Error(`Failed to fetch RSS feed: ${feedResponse.statusText}`);

        const feedText = await feedResponse.text();
        console.log("RSS feed loaded successfully.");
        // Parse and display episodes...
    } catch (error) {
        console.error("Error:", error.message);
        episodesContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
