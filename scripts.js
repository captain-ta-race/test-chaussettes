const podcastsListElement = document.getElementById("podcasts-list");

// Charger la liste des podcasts depuis le fichier JSON
async function loadPodcasts() {
    try {
        const response = await fetch("podcasts.json");
        if (!response.ok) throw new Error("Impossible de charger la liste des podcasts.");
        const podcasts = await response.json();

        // Effacer le message de chargement
        podcastsListElement.innerHTML = "";

        // Afficher chaque podcast
        podcasts.forEach(podcast => {
            const podcastCard = document.createElement("div");
            podcastCard.classList.add("podcast-card");

            podcastCard.innerHTML = `
    <img src="${podcast.image}" alt="Image du podcast ${podcast.title}" class="podcast-image">
    <div class="podcast-info">
        <h2 class="podcast-title">${podcast.title}</h2>
        <p class="podcast-description">${podcast.description}</p>
        <a href="podcast.html?title=${encodeURIComponent(podcast.title)}" class="podcast-link">Découvrir</a>
    </div>
            `;

            podcastsListElement.appendChild(podcastCard);
        });
    } catch (error) {
        podcastsListElement.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Charger les podcasts au chargement de la page
loadPodcasts();
