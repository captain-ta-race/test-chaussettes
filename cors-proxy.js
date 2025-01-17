const proxyUrl = "https://corsproxy.io/?";
const targetUrl = "https://feeds.acast.com/public/shows/643e619074b16500111cdbd5";

fetch(proxyUrl + targetUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement du flux RSS : ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log("Flux RSS récupéré :", data);
        // Traitez les données ici...
    })
    .catch(error => {
        console.error("Erreur :", error.message);
    });
