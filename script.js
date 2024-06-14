document.addEventListener('DOMContentLoaded', async () => {
    const username = "Proiserspp";
    const repo = "ParfümRezensionen";
    const token = "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";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/reviews.json`;

    const registrationForm = document.getElementById('registration-form');
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');
    let currentUser = '';

    // Funktion zum Abrufen der Bewertungen
    async function getReviews() {
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            const content = atob(response.data.content);
            return JSON.parse(content);
        } catch (error) {
            console.error("Fehler beim Abrufen der Bewertungen:", error);
            return [];
        }
    }

    // Funktion zum Aktualisieren der Bewertungen
    async function updateReviews(reviews) {
        try {
            const getResponse = await axios.get(apiUrl, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            const sha = getResponse.data.sha;
            const content = btoa(JSON.stringify(reviews, null, 2));

            await axios.put(apiUrl, {
                message: "Bewertungen aktualisieren",
                content: content,
                sha: sha
            }, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Bewertungen:", error);
        }
    }

    // Bei Seitenladung Bewertungen anzeigen
    const reviews = await getReviews();
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        reviewItem.innerHTML = `
            <strong>${review.user} über ${review.perfume}:</strong>
            <p>${review.review}</p>
        `;
        reviewsList.appendChild(reviewItem);
    });

    // Event Listener für Registrierungsformular
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username');
        currentUser = usernameInput.value.trim();
        if (currentUser) {
            alert(`Willkommen, ${currentUser}!`);
            registrationForm.style.display = 'none';
            reviewForm.style.display = 'block';
        }
    });

    // Event Listener für Bewertungsformular
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const perfumeInput = document.getElementById('perfume');
        const reviewInput = document.getElementById('review');

        const newReview = {
            user: currentUser,
            perfume: perfumeInput.value,
            review: reviewInput.value
        };

        reviews.push(newReview);
        await updateReviews(reviews);

        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        reviewItem.innerHTML = `
            <strong>${newReview.user} über ${newReview.perfume}:</strong>
            <p>${newReview.review}</p>
        `;
        reviewsList.appendChild(reviewItem);

        perfumeInput.value = '';
        reviewInput.value = '';
    });
});
