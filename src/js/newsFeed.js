import createRequest from "./api/createRequest";

export default class NewsFeed {
    constructor(container) {
        this.container = container;
    }

    Init() {
        this.addMarkup();
    }

    addMarkup() {
        const dashboard = document.createElement('div');
        dashboard.classList.add('dashboard');

        const title = document.createElement('h1');
        title.classList.add('title');
        title.textContent = 'в мире животных'.toUpperCase();

        const updateBtn = document.createElement('button');
        updateBtn.classList.add('update-btn');

        dashboard.appendChild(title);
        dashboard.appendChild(updateBtn);

        this.container.appendChild(dashboard);
    }

    loadNews() {
        createRequest('http://localhost:3000/news', 'GET');
    }


}