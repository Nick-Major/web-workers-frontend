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

    // loadNews() {
    //     createRequest()
    //         .then(news => console.log('Received news:', news))
    //         .then(news => news.forEach(item => {
    //             this.renderNews(item);
    //         }))
    //         .catch(error => console.error('Request failed:', error));
    // }

    loadNews() {
        createRequest()
            .then(news => {
                console.log('Received news:', news);
                news.forEach(item => {
                    this.renderNews(item);
                });
            })
            .catch(error => console.error('Request failed:', error));
    }

    renderNews(item) {
        const newsContainer = this.container.querySelector('.news-container');

        const newsItem = document.createElement('article');

        newsItem.innerHTML = `
            <h2 class="news-title">${item.header}</h2>
            <div class="news-content">
                <img class="news-img" src="${item.caption}" alt="${item.header}">
                <div class="news-content">${item.content}</div>
            </div>
        `;

        newsContainer.appendChild(newsItem);
    }


}