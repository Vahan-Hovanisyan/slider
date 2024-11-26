class Slider {
  constructor(elem, options) {
    let defaultOptions = {
      pagination: false,
      perView: 1,
      loop: false,
      autoPlay: false,
      autoPlayInterval: 3000,
      breackpoints: {},
    };

    this.options = Object.assign(defaultOptions, options);
    this.elem = document.querySelector(`[data-slider="${elem}"]`);
    this.list = this.elem.querySelector(".slider__list");
    this.slides = this.list.querySelectorAll(".slider__slide");
    this.sliesPerView = this.list.querySelectorAll(
      `.slider__slide:nth-child(${this.options.perView}n+1)`,
    );
    this.buttonPrev = this.elem.querySelector(".slider__button-prev");
    this.buttonNext = this.elem.querySelector(".slider__button-next");
    this.pagination = this.elem.querySelector(".slider__pagination");
    this.paginationButtons = this.pagination.querySelectorAll(
      ".slider__pagination-button",
    );

    this.init();
  }

  init() {
    if (this.options.breackpoints) this.setBreakpoints();
    if (this.options.loop) this.setLoop();
    if (this.options.pagination) this.setPagination();
    if (this.options.autoPlay) this.setAutoPlay();
    this.list.style.setProperty("--slider-per-view", this.options.perView);

    this.sliesPerView.forEach((slide, index) => {
      slide.setAttribute("data-index", index);
      this.setSlide(this.buttonPrev, "prev", slide);
      this.setSlide(this.buttonNext, "next", slide);
      this.setObserverSlides().observe(slide);
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
                button.classList.toggle(
                  "slider__pagination-button--active",
                  entry.target.dataset.index === button.dataset.index,
                );
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
      if (this.options.loop && dir === "next") this.setLoop();
    };
  }

  setPagination() {
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
    let interval = null;

    interval = setInterval(() => {
      this.list.scrollBy({
        left: this.list.offsetWidth,
        top: 0,
        behavior: "smooth",
      });

      if (this.options.loop) this.setLoop();
    }, this.options.autoPlayInterval);

    this.elem.onmouseenter = () => {
      clearInterval(interval);
    };

    this.elem.onmouseleave = () => {
      interval = setInterval(() => {
        this.list.scrollBy({
          left: this.list.offsetWidth,
          top: 0,
          behavior: "smooth",
        });

        if (this.options.loop) this.setLoop();
      }, this.options.autoPlayInterval);
    };
  }

  setLoop() {
    if (this.list.style.scrollBehavior === "smooth") {
      this.list.style.scrollBehavior = "auto";
    }
    if (
      this.list.scrollWidth ===
      this.list.scrollLeft + this.list.offsetWidth
    ) {
      this.list.scrollLeft = 0;
    }
  }

  setBreakpoints() {
    const updateBreakpoint = (key) => {
      const breakpoint = this.options.breackpoints[key];

      ["perView", "loop", "pagination", "autoPlay"].forEach((setting) => {
        if (setting in breakpoint) {
          this.options[setting] = breakpoint[setting];

          if (setting === "perView") {
            this.sliesPerView = this.list.querySelectorAll(
              `.slider__slide:nth-child(${this.options.perView}n+1)`,
            );
          }
        }
      });
    };

    Object.keys(this.options.breackpoints).forEach((key) => {
      const mediaQuery = window.matchMedia(`(min-width: ${key}px)`);

      if (mediaQuery.matches) {
        updateBreakpoint(key);
      }
    });
  }
}

new Slider("slider1", {
  pagination: true,
  perView: 1,
  autoPlay: true,
  loop: true,
  autoPlayInterval: 3000,
  breackpoints: {
    576: {
      perView: 2,
      loop: false,
      pagination: false,
      autoPlay: false,
    },
    768: {
      perView: 3,
      loop: true,
      pagination: true,
      autoPlay: true,
    },
  },
});
