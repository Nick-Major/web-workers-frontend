import createRequest from './api/createRequest';

export default class NewsFeed {
  constructor(container) {
    this.container = container;
  }

  init() {
    this.addMarkup();
    this.loadNews();
    this.addEventListeners();
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
    updateBtn.addEventListener('click', () => this.loadNews());

    const newsContainer = document.createElement('div');
    newsContainer.classList.add('news-container');

    // Добавляем заглушку
    const skeleton = document.createElement('div');
    skeleton.classList.add('skeleton-container');
    skeleton.innerHTML = `
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
    `;

    dashboard.appendChild(title);
    dashboard.appendChild(updateBtn);

    this.container.append(dashboard);
    this.container.append(newsContainer);
    newsContainer.appendChild(skeleton);
  }

  addEventListeners() {
    const updateBtn = document.querySelector('.update-btn');

    updateBtn.addEventListener('click', (event) => {
      createRequest();
    })
  }

  async loadNews() {
    try {
      // Очищаем контейнер перед загрузкой новых данных
      this.container.querySelector('.news-container').innerHTML = '';

      // Удаляем скелетон перед загрузкой данных
      const skeleton = this.container.querySelector('.skeleton-container');
      if (skeleton) {
        skeleton.remove();
      }
      
      // Пытаемся получить данные из кеша
      const cachedResponse = await caches.match('/news');
      if (cachedResponse) {
        const news = await cachedResponse.json();
        await this.renderFromCache(news);
      }

      // Загружаем свежие данные
      const freshNews = await createRequest();
      await this.renderNews(freshNews);
      
    } catch (error) {
      console.error('Error loading news:', error);
      this.showError('Не удалось загрузить новости');
      this.showSkeleton();
    }
  }

  async renderFromCache(news) {
    for (const item of news) {
      await this.renderNewsItem(item);
    }
  }

  async renderNews(news) {
    for (const item of news) {
      await this.renderNewsItem(item);
    }
  }

  async renderNewsItem(item) {
    try {
      const imageName = item.caption?.split('/').pop() || 'fallback.jpg';
      const imageUrl = `/images/${imageName}`;
      let imgUrl = '/images/fallback.jpg';

      // Пытаемся получить изображение из кэша через Service Worker
      try {
        const cache = await caches.open('animal-images');
        const cachedResponse = await cache.match(imageUrl);
        
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          imgUrl = URL.createObjectURL(blob);
          console.log('Изображение загружено из кэша:', imageName);
        } else {
          // Если нет в кэше, загружаем с сервера
          const response = await fetch(imageUrl);
          
          if (response.ok) {
            // Кэшируем новое изображение
            await cache.put(imageUrl, response.clone());
            const blob = await response.blob();
            imgUrl = URL.createObjectURL(blob);
            console.log('Изображение загружено с сервера и закэшировано:', imageName);
          } else {
            throw new Error('Image not found on server');
          }
        }
      } catch (cacheError) {
        console.warn('Ошибка работы с кэшем:', cacheError.message);
        // Пробуем загрузить напрямую (без кэширования)
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          imgUrl = URL.createObjectURL(blob);
        }
      }

      this.createNewsElement(item, imgUrl);
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error.message);
      // Пробуем получить fallback из кэша
      try {
        const cache = await caches.open('animal-images');
        const fallbackResponse = await cache.match('/images/fallback.jpg');
        const finalUrl = fallbackResponse ? 
          URL.createObjectURL(await fallbackResponse.blob()) : 
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGV4dCB4PSIxMCIgeT0iNTAiIGZpbGw9IiMwMDAiPk5vIGltYWdlPC90ZXh0Pjwvc3ZnPg==';
        
        this.createNewsElement(item, finalUrl);
      } catch (finalError) {
        console.error('Не удалось загрузить даже fallback:', finalError);
        this.createNewsElement(item, '');
      }
    }
  }

  createNewsElement(item, imgUrl) {
    const newsItem = document.createElement('article');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
      <h2 class="news-title">${item.header || 'Без названия'}</h2>
      <div class="news-content">
        <img class="news-img" src="${imgUrl}" alt="${item.header || ''}">
        <div class="text-content">${item.content || 'Нет содержимого'}</div>
      </div>    
    `;
    this.container.querySelector('.news-container').appendChild(newsItem);
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    this.container.querySelector('.news-container').appendChild(errorElement);
  }

  showSkeleton() {
    const newsContainer = this.container.querySelector('.news-container');
    newsContainer.innerHTML = '';
    
    const skeleton = document.createElement('div');
    skeleton.classList.add('skeleton-container');
    skeleton.innerHTML = `
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
      <div class="skeleton-title"></div>
      <div class="skeleton-content">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
      </div>
    `;
    
    newsContainer.appendChild(skeleton);
  }
}
