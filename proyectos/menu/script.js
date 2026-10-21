"use strict";

const filterButtons = document.querySelectorAll(".filter-button");
const menuCards = document.querySelectorAll(".menu-card");
const menuCount = document.querySelector("#menu-count");

function filterMenu(category) {
    let visibleItems = 0;

    menuCards.forEach((card) => {
        const matches = category === "todos" || card.dataset.category === category;
        card.hidden = !matches;
        if (matches) visibleItems += 1;
    });

    menuCount.textContent = `${visibleItems} ${visibleItems === 1 ? "opción" : "cosas ricas"}`;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((filterButton) => {
            const isSelected = filterButton === button;
            filterButton.classList.toggle("is-active", isSelected);
            filterButton.setAttribute("aria-pressed", String(isSelected));
        });

        filterMenu(button.dataset.filter);
    });
});
