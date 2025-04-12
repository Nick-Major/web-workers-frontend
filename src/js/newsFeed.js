import createRequest from "./api/createRequest";

export default class NewsFeed {
    constructor(container) {
        this.container = container;
    }

    init() {
        this.addMarkup();
        this.loadNews();
    }

    addMarkup() {
        const dashboard = document.createElement('div');
        dashboard.classList.add('dashboard');

        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = 'в мире животных'.toUpperCase();

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('update-btn');
        updateBtn.textContent = 'Обновить';

        const newsContainer = document.createElement('div');
        newsContainer.classList.add('news-container');

        dashboard.appendChild(title);
        dashboard.appendChild(updateBtn);

        console.log(this.container);
        

        this.container.append(dashboard);
        this.container.append(newsContainer);
    }

    loadNews() {
        createRequest()
            .then(news => console.log('Received news:', news))
            .catch(error => console.error('Request failed:', error));
    }


}