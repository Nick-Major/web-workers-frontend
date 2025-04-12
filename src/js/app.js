import NewsFeed from "./newsFeed";

const root = document.querySelector('.root');

const app = new NewsFeed(root);

app.init();