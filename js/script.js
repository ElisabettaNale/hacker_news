// Constants
const HACKERNEWS_URL = "https://hacker-news.firebaseio.com/v0/";
const DATE_OPTIONS = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin', 
    hour12: false 
};

// Function to format a date
function formatDate(date) {
    return new Date(date * 1000).toLocaleString('en-GB', DATE_OPTIONS) + ' (CET)';
}

// Function to display an error message
function displayError(message) {
    errorElement = document.querySelector('.error');
    errorElement.textContent = message;
}

// Function to create DOM elements
function createElement(type, cssClass, text = "", attributes = {}) {
    let element = document.createElement(type);
    element.classList.add(cssClass);
    for (let attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    element.textContent = text;
    return element;
}

// Function to create a news element
function createNewsElement(news) {
    let newsBox = createElement("div", "news-box");
    let newsTitle = createElement("p", "news-title", news.title);
    let newsLinkContainer = createElement("div", "news-link-container");
    let newsLinkIcon = createElement("img", "news-link-icon", "", {"src": "img/news-search.svg"});
    let newsLinkShort = news.link.split("/").slice(0, 3).join("/");
    let newsLink = createElement("a", "news-link", newsLinkShort, {"href": news.link,
                                                               "target": "_blank" 
    });
    let newsDateContainer = createElement("div", "news-date-container");
    let newsDateIcon = createElement("img", "news-date-icon", "", {"src": "img/calendar.svg"});
    let newsDate = createElement("p", "news-date", news.date);
    newsLinkContainer.appendChild(newsLinkIcon);
    newsLinkContainer.appendChild(newsLink);
    newsDateContainer.appendChild(newsDateIcon);
    newsDateContainer.appendChild(newsDate);
    newsBox.appendChild(newsTitle);
    newsBox.appendChild(newsLinkContainer);
    newsBox.appendChild(newsDateContainer);
    return newsBox;
}

// Function to add a news to the board
function addNews (newsBoard, news) {
    let newNews = createNewsElement(news);
    newsBoard.appendChild(newNews);
    setTimeout(() => {
        newNews.classList.add('news-box-visible');
    }, 500);
}

// Function to fetch new stories from Hacker News
async function fetchHackerNewsIds() {
    let response = await fetch(`${HACKERNEWS_URL}newstories.json?print=pretty`);
    if (!response.ok) {
        displayError(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

// Function to fetch a news by ID
async function fetchNewsById(id) {
    let response = await fetch(`${HACKERNEWS_URL}item/${id}.json`);
    if (!response.ok) {
        displayError(`HTTP error! Status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let news = await response.json();
    news.time = formatDate(news.time);
    news.url = news.url || "Not available";
    return { title: news.title, link: news.url, date: news.time };
}

// Function to update the last update time
function updateLastUpdateTime() {
    let lastUpdateTime = document.querySelector(".last-update-time");
    lastUpdateTime.textContent = `Last update: ${new Date().toLocaleString('en-GB', DATE_OPTIONS)} (CET)`;
    lastUpdateTime.style.display = 'block';
}

// Function to load news on the board
async function loadNews() {
    
    try {
        let newsIds = await fetchHackerNewsIds();
        let newsArray = await Promise.all(newsIds.slice(currentIndex, currentIndex + loadIncrement).map(fetchNewsById));
        updateLastUpdateTime();
        newsArray.forEach((news, index) => {
            setTimeout(() => addNews(hackerNewsBoard, news), 300 * index);
        });
        
        currentIndex = currentIndex + loadIncrement;
        
        if (currentIndex >= newsIds.length) {
            loadMoreButton.style.display = 'none';
            displayError("All news loaded. No more news available.");
        } else {
            setTimeout(() => {
                loadMoreButton.style.display = 'block';
            }, 300 * newsArray.length);    
        }

    } catch (error) {
        console.error("Error: ", error);
        displayError("Failed to load news.");
    }
}

///////////////////////////////////////////////////////////////
// Main
///////////////////////////////////////////////////////////////

let currentIndex = 0;
const loadIncrement = 10;
let hackerNewsBoard = document.querySelector('.news-container');
let loadMoreButton = document.querySelector('.load-more-button');
loadNews();
loadMoreButton.addEventListener("click", loadNews);
