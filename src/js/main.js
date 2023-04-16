// Import our custom CSS
import '../scss/styles.scss';

// Import only the Bootstrap components we need
import { Popover } from 'bootstrap';

const checkbox = document.getElementById("checkbox");
function themeToggle(elem) {
    if (elem.checked) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light')
    }
}
themeToggle(checkbox);

checkbox.addEventListener("change", () => {
    themeToggle(checkbox);
});

const url = "https://picsum.photos/v2/list?page=1&limit=9";

const strs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Phasellus luctus elit id nibh rhoncus, nec ultricies libero vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Maecenas in consequat convallis.",
    "Sed vulputate nibh a turpis elementum, sit amet dapibus purus pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Nunc convallis orci ac ipsum malesuada, a sollicitudin urna laoreet.",
    "Vivamus eu risus in dolor congue maximus.",
    "Etiam vitae libero eu mi facilisis interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Fusce ultrices ante id nunc congue imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Suspendisse varius quam nec mauris elementum, a sagittis velit tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed vestibulum mi ac sapien scelerisque, non consectetur nulla feugiat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Aliquam consectetur diam vitae diam pellentesque, in venenatis sapien accumsan. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "In faucibus elit id felis congue congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Proin hendrerit enim sit amet urna.",
    "Donec malesuada erat quis arcu pretium, eget bibendum dolor bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
];

let showNextItems;

fetch(url)
    .then(res => res.json())
    .then((out) => {
        showNextItems = showNextFourItems(out);
        showNextItems();
    })
    .catch(err => { throw err });

function render(data) {
    const container = document.querySelector('#grid');
    const item = `
            <div class="col-12 col-sm-6 mt-4">
            <div class="card h-100 ">
              <div class="card-media">
                <img class="card-img-top" src="${data.download_url}" alt="${data.author}" loading="lazy">
              </div>
              <div class="card-body">
                <h4 class="card-title">${data.author}</h4>
                <div class="card-description">
                </div>
              </div>
              <div class="card-footer pb-3 d-flex ">
                <button class="btn btn-orange mt-3">
                  Save to collection
                </button>
                <a href="${data.url}" target="_blank" class="btn btn-out mt-3">
                  Share
                </a>
              </div>
            </div>
          </div>
          `;
    container.insertAdjacentHTML('beforeend', item);
}

function getRandomString(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function truncateText() {
    let str = getRandomString(strs);
    let truncatedText = str;
    let isTruncated = false;

    if (str.length > 75) {
        truncatedText = str.slice(0, 75) + '...';
        isTruncated = true;
    }

    const descriptionBlock = document.createElement('div');
    descriptionBlock.classList.add("card-description");
    descriptionBlock.innerHTML = `<p class="card-text m-0">${truncatedText}</p>`;

    if (isTruncated) {
        const button = document.createElement('button');
        button.classList.add('show-more','mt-2')
        button.textContent = 'Show more...';
        button.addEventListener('click', () => {
            descriptionBlock.innerHTML = `<p class="card-text m-0">${str}</p>`;
        });
        descriptionBlock.appendChild(button);
    }

    return descriptionBlock;
}

function showNextFourItems(items) {
    let currentIndex = 0;

    return function () {
        if (currentIndex >= items.length) {
            console.log("All items are shown)");
            return;
        }

        const endIndex = Math.min(currentIndex + 4, items.length);
        const currentItems = items.slice(currentIndex, endIndex);

        for (let item of currentItems) {
            render(item)
        }

        let sibling = document.querySelectorAll('.card-title');
        sibling.forEach((elem, index) => {
            index
            if (index >= currentIndex && index <= endIndex) {
                elem.after(truncateText())
            }
        });

        currentIndex = endIndex;
    }
}

window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        showNextItems();
    }
};