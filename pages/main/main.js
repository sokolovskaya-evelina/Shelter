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
    main(data);
  })
  .catch((error) => console.error(error));

function main(dataPets) {
  let pets = dataPets;
  let randomPets = [];
  let prevRandomPets = [];

  function createRandomPets(countCard) {
    prevRandomPets = randomPets;
    randomPets = [];
    for (let i = 0; i < countCard; i++) {
      if (pets.length === 0) pets = dataPets;
      const randomIndex = randomInteger(0, pets.length - 1);
      const elem = pets.find((x, i) => i === randomIndex);
      if (
        randomPets.includes(pets[randomIndex]) ||
        prevRandomPets.some((el) => el.name === pets[randomIndex].name)
      ) {
        i--;
      } else {
        randomPets.push(elem);
        pets = pets.filter((x, i) => i !== randomIndex);
      }
    }
    return randomPets;
  }

  function renderCardsCarousel(direction) {
    const blockSlides = document.querySelector(".container-slides");

    const slide = document.createElement("div");

    slide.classList.add("slide");
    createRandomPets(setCountCard()).forEach((el) => {
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

      slide.append(card);
    });

    if (direction === "next") blockSlides.append(slide);
    if (direction === "prev") blockSlides.prepend(slide);
  }

  function controlCarousel() {
    const next = document.querySelector(".control.right");
    const prev = document.querySelector(".control.left");
    let isEnabled = true;

    next.addEventListener("click", nextPage);
    prev.addEventListener("click", prevPage);

    function nextPage() {
      if (isEnabled) {
        renderCardsCarousel("next");
        animationPage("to-left");
      }
    }

    function prevPage() {
      if (isEnabled) {
        renderCardsCarousel("prev");
        animationPage("to-right");
      }
    }

    function animationPage(direction) {
      let slide = document.querySelectorAll(".slide");
      isEnabled = false;
      slide[0].classList.add(direction);
      slide[0].addEventListener("animationend", function () {
        slide[0].classList.remove(direction);
        if (direction === "to-left") slide[0].remove();
      });
      slide[1].classList.add(direction);
      slide[1].addEventListener("animationend", function () {
        this.classList.remove(direction);
        if (direction === "to-right") slide[1].remove();
        isEnabled = true;
      });
    }
  }

  function setCountCard() {
    let countCard = 0;
    const widthPage = window.innerWidth;
    if (widthPage >= 1280) {
      countCard = 3;
    } else if (widthPage <= 1280 && widthPage >= 768) {
      countCard = 2;
    } else {
      countCard = 1;
    }
    return countCard;
  }

  renderCardsCarousel("next");
  controlCarousel();
}
