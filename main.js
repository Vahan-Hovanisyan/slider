function slider({ elem, slidePerView = 1, slideToScroll = 1 }) {
  const slider = document.querySelector(`[data-slider="${elem}"]`);
  const sliderList = slider.querySelector('.slider__list');
  const sliderSlides = slider.querySelectorAll('.slider__slide');
  const sliderButtonPrev = slider.querySelector('.slider__button-prev');
  const sliderButtonNext = slider.querySelector('.slider__button-next');

  sliderSlides.forEach((slide) => {
    slide.style.minWidth = `calc(100% / ${slidePerView})`;

    sliderButtonPrev.onclick = () => {
      sliderList.scrollBy(-slide.offsetWidth * slideToScroll, 0);
    };

    sliderButtonNext.onclick = () => {
      sliderList.scrollBy(slide.offsetWidth * slideToScroll, 0);
    };
  });
}

slider({
  elem: 'slider1',
  slidePerView: 2,
  slideToScroll: 2,
});
