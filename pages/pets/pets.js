async function getPets() {
  const url = "../../assets/pets.json";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}, received ${response.status}`);
  }
  return response.json();
}

getPets()
  .then((data) => {
    pets(data);
  })
  .catch((error) => console.error(error));

function pets(dataPets) {
  let randomPets = [];

  function createRandomPets(data) {
    if (data !== undefined) {
      let pets = data;
      let temporaryArray = [];
      for (let i = 0; i < 48; i++) {
        if (pets.length === 0) pets = data;
        const randomIndex = randomInteger(0, pets.length - 1);
        const elem = pets.find((x, i) => i === randomIndex);

        if (temporaryArray.includes(pets[randomIndex])) {
          i--;
        } else {
          temporaryArray.push(elem);

          if (temporaryArray.length === setCountCard()[0]) {
            randomPets.push(temporaryArray);
            temporaryArray = [];
          }

          pets = pets.filter((x, i) => i !== randomIndex);
        }
      }
      randomPets = randomPets.flat();
      renderCards("next", 1);
    }
  }

  function renderCards(direction, page) {
    const blockSlides = document.querySelector(".block-slides");

    const slides = document.createElement("div");
    slides.classList.add("slides");

    randomPets.forEach((el, i) => {
      if (i >= (page - 1) * setCountCard()[0] && i < page * setCountCard()[0]) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src=${el.img} alt=${el.name}/>
          <h5>${el.name}</h5>
          <button class="btn-white">Learn more</button>
          `;
        card.addEventListener("click", () => {
          addPopup(el);
        });
        slides.append(card);
      }
    });
    if (direction === "next") blockSlides.append(slides);
    if (direction === "prev") blockSlides.prepend(slides);
  }

  function controlPagination() {
    const next = document.querySelector(".btn-control.next");
    const prev = document.querySelector(".btn-control.prev");
    const toEnd = document.querySelector(".btn-control.to-end");
    const toStart = document.querySelector(".btn-control.to-start");
    const blockCountPage = document.querySelector(".count-page");
    let currentPage = blockCountPage.innerText;
    let isEnabled = true;

    next.addEventListener("click", nextPage);
    toEnd.addEventListener("click", goToEnd);

    function nextPage() {
      if (isEnabled) {
        currentPage++;
        currentPage >= setCountCard()[1]
          ? disabled(next, toEnd)
          : included(prev, toStart);
        renderCards("next", currentPage, setCountCard()[0]);
        animationPage("to-left");
        blockCountPage.innerText = `${currentPage}`;
      }
    }

    function prevPage() {
      if (isEnabled) {
        currentPage--;
        currentPage === 1 ? disabled(prev, toStart) : included(next, toEnd);
        if (currentPage >= setCountCard()[1]) {
          currentPage = setCountCard()[1];
          disabled(next, toEnd);
        }
        renderCards("prev", currentPage, setCountCard()[0]);
        animationPage("to-right");
        blockCountPage.innerText = `${currentPage}`;
      }
    }

    function goToEnd() {
      if (isEnabled) {
        disabled(next, toEnd);
        included(prev, toStart);
        currentPage = setCountCard()[1];
        renderCards("next", currentPage, setCountCard()[0]);
        animationPage("to-left");
        blockCountPage.innerText = `${currentPage}`;
      }
    }

    function goToStart() {
      if (isEnabled) {
        disabled(prev, toStart);
        included(next, toEnd);
        currentPage = 1;
        renderCards("prev", currentPage, setCountCard()[0]);
        animationPage("to-right");
        blockCountPage.innerText = `${currentPage}`;
      }
    }

    function animationPage(direction) {
      let slides = document.querySelectorAll(".slides");
      isEnabled = false;
      slides[0].classList.add(direction);
      slides[0].addEventListener("animationend", function () {
        slides[0].classList.remove(direction);
        if (direction === "to-left") slides[0].remove();
      });
      slides[1].classList.add(direction);
      slides[1].addEventListener("animationend", function () {
        this.classList.remove(direction);
        if (direction === "to-right") slides[1].remove();
        isEnabled = true;
      });
    }

    function disabled(direction, directionEnd) {
      direction.classList.add("disabled");
      directionEnd.classList.add("disabled");
      direction.setAttribute("disabled", "true");
      directionEnd.setAttribute("disabled", "true");
      if (
        direction.classList.contains("next") ||
        directionEnd.classList.contains("to-end")
      ) {
        direction.removeEventListener("click", nextPage);
        directionEnd.removeEventListener("click", goToEnd);
      } else {
        direction.removeEventListener("click", prevPage);
        directionEnd.removeEventListener("click", goToStart);
      }
    }

    function included(direction, directionEnd) {
      direction.classList.remove("disabled");
      directionEnd.classList.remove("disabled");
      direction.removeAttribute("disabled");
      directionEnd.removeAttribute("disabled");
      if (
        direction.classList.contains("next") ||
        directionEnd.classList.contains("to-end")
      ) {
        direction.addEventListener("click", nextPage);
        directionEnd.addEventListener("click", goToEnd);
      } else {
        direction.addEventListener("click", prevPage);
        directionEnd.addEventListener("click", goToStart);
      }
    }
  }

  function setCountCard() {
    const widthPage = window.innerWidth;
    if (widthPage >= 1280) {
      countCard = 8;
      countPage = 48 / countCard;
    } else if (widthPage < 1280 && widthPage >= 768) {
      countCard = 6;
      countPage = 48 / countCard;
    } else {
      countCard = 3;
      countPage = 48 / countCard;
    }
    return [countCard, countPage];
  }

  createRandomPets(dataPets);
  controlPagination();
}
