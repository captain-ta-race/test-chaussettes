// Récupérer le titre du podcast depuis les paramètres d'URL
const urlParams = new URLSearchParams(window.location.search);
const podcastTitle = urlParams.get("title");

// Élément où afficher les informations du podcast
const podcastTitleElement = document.getElementById("podcast-title");
const podcastInfoElement = document.getElementById("podcast-info");

// Charger la liste des podcasts depuis le fichier JSON
async function loadPodcastDetails() {
    try {
        const response = await fetch("podcasts.json");
        if (!response.ok) throw new Error("Impossible de charger la liste des podcasts.");
        const podcasts = await response.json();

        // Trouver le podcast correspondant au titre
        const podcast = podcasts.find(p => p.title === podcastTitle);

        if (!podcast) {
            throw new Error("Podcast non trouvé.");
        }

        // Mettre à jour la page avec les informations du podcast
        podcastTitleElement.textContent = podcast.title;
        podcastInfoElement.innerHTML = `
            <img src="${podcast.image}" alt="Image du podcast ${podcast.title}" class="podcast-image-large">
            <p>${podcast.description}</p>
            <a href="${podcast.rss}" target="_blank" class="podcast-link">Écouter le podcast</a>
        `;
    } catch (error) {
        podcastInfoElement.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Charger les informations du podcast
loadPodcastDetails();
