// Lien vers le flux RSS
const rssFeedUrl = "https://corsproxy.io/?https://feeds.acast.com/public/shows/6728ae32dc854c9577f0ce16"; // Utilise ton flux réel ici
const episodesContainer = document.getElementById("episodes");

// Taille maximale pour le préchargement (3 Mo en octets)
const MAX_PRELOAD_SIZE = 3 * 1024 * 1024;

// Fonction principale pour charger le flux RSS
async function loadPodcast() {
    try {
        const response = await fetch(rssFeedUrl);
        if (!response.ok) throw new Error("Erreur lors de la récupération du flux RSS.");
        
        const rssText = await response.text();
        const parser = new DOMParser();
        const rssXml = parser.parseFromString(rssText, "application/xml");

        // Charger les informations générales du podcast
        const podcastTitle = rssXml.querySelector("channel > title").textContent;
        const podcastDescription = rssXml.querySelector("channel > description").textContent;
        const podcastImage = rssXml.querySelector("channel > image > url")?.textContent || '';

        displayPodcastInfo(podcastTitle, cleanText(podcastDescription), podcastImage);

        // Charger les épisodes
        const items = rssXml.querySelectorAll("item");
        for (const item of items) {
            const title = item.querySelector("title").textContent;
            const audioUrl = item.querySelector("enclosure")?.getAttribute("url");
            const description = item.querySelector("description")?.textContent || "Aucune description disponible.";
            const episodeImage = item.querySelector("itunes\\:image")?.getAttribute("href") || podcastImage;

            if (audioUrl) {
                // Précharger 3 Mo du fichier audio
                const blobUrl = await fetchPartialAudio(audioUrl, MAX_PRELOAD_SIZE);
                displayEpisode(title, blobUrl, cleanText(description), episodeImage);
            }
        }
    } catch (error) {
        episodesContainer.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Fonction pour afficher les informations générales du podcast
function displayPodcastInfo(title, description, imageUrl) {
    const header = document.querySelector(".header .container");

    // Ajouter l'image du podcast
    if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;
        img.classList.add("podcast-image");
        header.prepend(img);
    }

    // Ajouter la description du podcast
    const subtitle = document.createElement("p");
    subtitle.textContent = description;
    subtitle.classList.add("subtitle");
    header.appendChild(subtitle);
}

// Fonction pour afficher un épisode
function displayEpisode(title, audioUrl, description, imageUrl) {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode");

    // Miniature de l'épisode
    if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;
        img.classList.add("episode-image");
        episodeDiv.appendChild(img);
    }

    // Conteneur pour le texte et le player
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("episode-content");

    // Titre de l'épisode
    const titleElement = document.createElement("div");
    titleElement.textContent = title;
    titleElement.classList.add("episode-title");

    // Description de l'épisode
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;
    descriptionElement.classList.add("episode-description");

    // Player audio
    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.src = audioUrl;

    // Ajouter les éléments au conteneur de contenu
    contentDiv.appendChild(titleElement);
    contentDiv.appendChild(descriptionElement);
    contentDiv.appendChild(audioElement);

    // Ajouter la miniature et le contenu à l'épisode
    episodeDiv.appendChild(contentDiv);
    episodesContainer.appendChild(episodeDiv);
}

// Fonction pour nettoyer le texte HTML et récupérer du texte brut
function cleanText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

// Fonction pour précharger une partie du fichier audio
async function fetchPartialAudio(url, maxBytes) {
    const response = await fetch(url, {
        headers: {
            Range: `bytes=0-${maxBytes - 1}`, // Télécharge seulement les premiers maxBytes octets
        },
    });

    if (!response.ok) throw new Error(`Impossible de précharger l'audio depuis ${url}`);
    
    const blob = await response.blob();
    return URL.createObjectURL(blob); // Crée un URL Blob pour le player audio
}

// Charger les données au chargement de la page
loadPodcast();
