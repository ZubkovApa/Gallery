document.addEventListener('DOMContentLoaded', () => {
    let galleryData = JSON.parse(localStorage.getItem('gallery')) || [];
    const filtersContainer = document.getElementById('filters');
    const galleryContainer = document.getElementById('gallery');
    const modal = document.getElementById('modal');
    const viewModal = document.getElementById('viewModal');
    const imageForm = document.getElementById('imageForm');

    // Инициализация
    updateFilters();
    renderGallery();

    // Обработчики событий
    document.getElementById('openModal').addEventListener('click', () => modal.style.display = 'block');
    document.querySelector('.close').addEventListener('click', () => modal.style.display = 'none');
    document.querySelector('.close-view').addEventListener('click', () => viewModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === viewModal) viewModal.style.display = 'none';
    });

    imageForm.addEventListener('submit', addNewImage);
    galleryContainer.addEventListener('click', handleCardClick);
    filtersContainer.addEventListener('click', filterGallery);

    function renderGallery() {
        galleryContainer.innerHTML = galleryData.map((item, index) => `
            <div class="card" data-tags="${item.tags.join(',')}">
                <div class="delete-btn">×</div>
                <img src="${item.url}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    function updateFilters() {
        const allTags = [...new Set(galleryData.flatMap(item => item.tags))];
        filtersContainer.innerHTML = `
            <button class="filter-btn" data-tag="all">All</button>
            ${allTags.map(tag => `
                <button class="filter-btn" data-tag="${tag}">${tag}</button>
            `).join('')}
        `;
    }

    function filterGallery(e) {
        if (!e.target.classList.contains('filter-btn')) return;
        const tag = e.target.dataset.tag;
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const cardTags = card.dataset.tags.split(',');
            const shouldShow = tag === 'all' || cardTags.includes(tag);
            card.classList.toggle('hidden', !shouldShow);
        });
    }

    function addNewImage(e) {
        e.preventDefault();
        const newImage = {
            url: document.getElementById('imageUrl').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            tags: document.getElementById('tags').value.split(',').map(t => t.trim())
        };

        galleryData.push(newImage);
        localStorage.setItem('gallery', JSON.stringify(galleryData));
        renderGallery();
        updateFilters();
        modal.style.display = 'none';
        imageForm.reset();
    }

    function handleCardClick(e) {
        const card = e.target.closest('.card');
        if (!card) return;

        if (e.target.classList.contains('delete-btn')) {
            const index = [...galleryContainer.children].indexOf(card);
            galleryData.splice(index, 1);
            localStorage.setItem('gallery', JSON.stringify(galleryData));
            card.remove();
            updateFilters();
        } else {
            const img = card.querySelector('img');
            document.getElementById('expandedImg').src = img.src;
            viewModal.style.display = 'flex';
        }
    }
});
