class Slider {
  constructor(elem, options) {
    let defaultOptions = {
      gap: 0,
      pagination: false,
      perView: 1,
      loop: false,
      autoPlay: false,
      autoPlayInterval: 3000,
      breakpoints: {},
    };

    this.options = Object.assign(defaultOptions, options);
    this.options2 = Object.assign(defaultOptions, options);
    this.elem = document.querySelector(`[data-slider="${elem}"]`);
    this.list = this.elem.querySelector(".slider__list");
    this.slides = this.list.querySelectorAll(".slider__slide");
    this.sliesPerView = this.list.querySelectorAll(
      `.slider__slide:nth-child(${this.options.perView}n+1)`,
    );
    this.buttonPrev = document.querySelector(".slider__button-prev");
    this.buttonNext = document.querySelector(".slider__button-next");
    this.pagination = this.elem.querySelector(".slider__pagination");
    this.paginationButtons = this.pagination.querySelectorAll(
      ".slider__pagination-button",
    );

    this.init();
    this.setBreakpoints();
  }

  init() {
    this.setPagination();
    this.setAutoPlay();
    this.setBreakpoints();

    this.elem.style.setProperty("--per-view", this.options.perView);
    if (this.options.perView > 1) {
      const gap = this.options.gap / this.options.perView;
      this.list.style.setProperty("--gap", this.options.gap - gap + "px");
      this.list.style.gap = this.options.gap + "px";
      console.log(gap);
    }
    this.sliesPerView.forEach((slide, index) => {
      slide.setAttribute("data-index", index);
      this.setObserverSlides().observe(slide);

      this.setSlide(this.buttonPrev, "prev", slide);
      this.setSlide(this.buttonNext, "next", slide);
    });
  }

  setObserverSlides() {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .closest(`[data-slider]`)
              .querySelectorAll(".slider__pagination-button")
              .forEach((button) => {
                if (button.dataset.index == entry.target.dataset.index)
                  button.classList.add("slider__pagination-button--active");
              });
          } else {
            entry.target
              .closest(`[data-slider]`)
              .querySelectorAll(".slider__pagination-button")
              .forEach((button) => {
                if (button.dataset.index == entry.target.dataset.index)
                  button.classList.remove("slider__pagination-button--active");
              });
          }
        });
      },
      {
        //rootMargin: "0px -5px 0px -5px",
        threshold: 0.5,
      },
    );
  }

  setSlide(elem, dir, slide) {
    elem.onclick = () => {
      this.list.scrollBy({
        left: dir === "next" ? slide.offsetWidth : -slide.offsetWidth,
        top: 0,
        behavior: "smooth",
      });
      if (dir === "next") this.setLoop();
    };
  }

  setPagination() {
    if (!this.options.pagination) return;
    let index = this.options.perView;
    let count = this.slides.length / index;
    for (let i = 0; i < count; i++) {
      const paginationButton = document.createElement("button");
      paginationButton.setAttribute("data-index", i);
      paginationButton.innerHTML = i + 1;
      paginationButton.classList.add("slider__pagination-button");
      this.pagination.append(paginationButton);
      paginationButton.onclick = () => {
        this.list.style.scrollBehavior = "smooth";
        this.list.scrollLeft = i * this.list.offsetWidth;
      };
    }
  }

  setAutoPlay() {
    if (!this.options.autoPlay) return;
    let interval;

    const startAutoPlay = () => {
      interval = setInterval(() => {
        this.list.scrollBy({
          left: this.list.offsetWidth,
          top: 0,
          behavior: "smooth",
        });

        this.setLoop();
      }, this.options.autoPlayInterval);
    };

    const stopAutoPlay = () => {
      clearInterval(interval);
    };

    startAutoPlay();

    this.elem.addEventListener("mouseenter", stopAutoPlay);
    this.elem.addEventListener("mouseleave", startAutoPlay);
  }

  setLoop() {
    if (!this.options.loop) return;
    const { style, scrollWidth, scrollLeft, offsetWidth } = this.list;

    if (style.scrollBehavior === "smooth") {
      style.scrollBehavior = "auto";
    }

    if (scrollLeft + offsetWidth >= scrollWidth) {
      this.list.scrollLeft = 0;
    }
  }

  setBreakpoints() {
    if (Object.keys(this.options.breakpoints).length === 0) return;
    const breakpoints = Object.assign(this.options.breakpoints, {
      0: { ...this.options },
    });
    new ResizeObserver((entries) => {
      Object.entries(breakpoints).forEach(([minWidth, settings]) => {
        if (entries[0].contentRect.width >= +minWidth) {
          this.slides.forEach((slide) => {
            slide.removeAttribute("data-index");
          });

          this.list
            .querySelectorAll(
              `.slider__slide:nth-child(${settings.perView}n+1)`,
            )
            .forEach((slide, index) => {
              slide.setAttribute("data-index", index);
              this.setObserverSlides().observe(slide);
            });
          this.options = Object.assign(this.options, settings);
          this.list.style.setProperty("--gap", 0 + "px");
          this.list.style.gap = 0 + "px";
          if ("gap" in settings) {
            const gap = settings.gap / settings.perView;
            this.list.style.setProperty("--gap", settings.gap - gap + "px");
            this.list.style.gap = settings.gap + "px";
            console.log(gap);
          }
          this.elem.style.setProperty("--per-view", settings.perView);
          this.pagination.innerHTML = "";
          this.setPagination();
        }
      });
    }).observe(document.body);
  }
}

new Slider("slider1", {
  pagination: true,
  perView: 1,
  autoPlay: true,
  loop: true,
  autoPlayInterval: 3000,
  breakpoints: {
    576: {
      gap: 30,
      perView: 2,
      loop: false,
      pagination: false,
      autoPlay: false,
    },
    768: {
      //gap: 51,
      perView: 3,
      loop: true,
      pagination: true,
      autoPlay: true,
    },
  },
});
