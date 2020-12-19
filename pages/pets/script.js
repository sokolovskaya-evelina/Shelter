const cards = document.querySelectorAll(".card");

function disableLink() {
  const disableLinksHeader = document.querySelectorAll(".header-menu .disable");
  disableLinksHeader.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

function burger() {
  const header = document.querySelector("header");
  const burgerMenu = document.querySelector(".burger-menu");
  const bgMenu = document.querySelector(".bg-menu");
  const activeLinkHeader = document.querySelector(".header-menu .active");
  const popupBurger = document.querySelector(".popup-burger");
  const mainLogo = document.querySelector(".main-logo");

  burgerMenu.addEventListener("click", toggleBurgerMenu);
  popupBurger.addEventListener("click", toggleBurgerMenu);
  activeLinkHeader.addEventListener("click", toggleBurgerMenu);

  function toggleBurgerMenu(event) {
    if (popupBurger.style.display === "none") {
      bgMenu.classList.add("open-menu");
      burgerMenu.classList.add("animation-burger");
      mainLogo.classList.add("close");
      popupBurger.style.display = "flex";
      document.body.style.overflow = "hidden";
      header.classList.add("transparent");
      setTimeout(() => {
        popupBurger.style.opacity = "1";
        header.addEventListener("click", toggleBurgerMenu);
      }, 0);
    } else {
      if (
        event.target.className !== "header-menu" &&
        !event.target.classList.contains("disable")
      ) {
        header.removeEventListener("click", toggleBurgerMenu);
        header.classList.remove("transparent");
        bgMenu.classList.remove("open-menu");
        burgerMenu.classList.remove("animation-burger");
        mainLogo.classList.remove("close");
        popupBurger.style.opacity = "0";
        setTimeout(() => {
          popupBurger.style.display = "none";
          document.body.style.overflow = "visible";
        }, 400);
      }
    }
  }
}

function addPopup(pets) {
  const content = document.createElement("div");
  const popupCard = document.querySelector(".popup-card");
  content.classList.add("content");
  content.style.opacity = "0";
  content.innerHTML = `
        <img class="img-pets" src=${pets.img} alt=${pets.name}>
        <div class="block-text">
            <div class="control close">
                <img src="../../assets/icons/close.svg" alt="close" />
            </div>
            <h3>${pets.name}</h3>
            <h4>${pets.type} - ${pets.breed}</h4>
            <p>${pets.description}</p>
            <ul>
                <li><strong>Age: </strong><span>${pets.age}</span></li>
                <li><strong>Inoculations: </strong><span>${pets.inoculations}</span></li>
                <li><strong>Diseases: </strong><span>${pets.diseases}</span></li>
                <li><strong>Parasites: </strong><span>${pets.parasites}</span></li>
            </ul>
        </div>
  `;
  popupCard.append(content);

  function openPopup() {
    if (window.innerWidth !== document.documentElement.clientWidth) {
      let paddingRight =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${paddingRight}px`;
      document.querySelector("header").style.right = `${8.5}px`;
    }
    popupCard.style.display = "flex";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      popupCard.style.opacity = "1";
      content.style.opacity = "1";
    }, 0);
  }

  function closePopup() {
    const close = document.querySelector(".control.close");
    close.addEventListener("click", () => {
      popupCard.style.opacity = "0";
      content.style.opacity = "0";
      setTimeout(() => {
        content.remove();
        popupCard.style.display = "none";
        document.body.style.overflow = "visible";
        document.body.style.paddingRight = "0px";
        document.querySelector("header").style.right = "0px";
      }, 400);
    });
    popupCard.addEventListener("click", (event) => {
      if (event.target.className === "popup-card") {
        popupCard.style.opacity = "0";
        content.style.opacity = "0";
        setTimeout(() => {
          content.remove();
          popupCard.style.display = "none";
          document.body.style.overflow = "visible";
          document.body.style.paddingRight = "0px";
          document.querySelector("header").style.right = "0px";
        }, 400);
      }
    });
    popupCard.addEventListener("mouseover", (event) => {
      const close = document.querySelector(".control.close");
      if (event.target.className === "popup-card") {
        close.classList.add("active");
      }
    });
    popupCard.addEventListener("mouseout", (event) => {
      if (event.target.className === "popup-card") {
        close.classList.remove("active");
      }
    });
  }

  openPopup();
  closePopup();
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

disableLink();
burger();
