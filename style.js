const prevBtn = document.querySelector(".slide-btn.prev");
const nextBtn = document.querySelector(".slide-btn.next");
const cardList = document.querySelector(".card-list");

let scrollPosition = 0;
const cardWidth = document.querySelector(".order-card").offsetWidth + 20; 

nextBtn.addEventListener("click", () => {
  scrollPosition += cardWidth;
  if(scrollPosition > cardList.scrollWidth - cardList.clientWidth) {
    scrollPosition = cardList.scrollWidth - cardList.clientWidth;
  }
  cardList.scrollTo({ left: scrollPosition, behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
  scrollPosition -= cardWidth;
  if(scrollPosition < 0) scrollPosition = 0;
  cardList.scrollTo({ left: scrollPosition, behavior: "smooth" });
});
