function slider(elem, pagination = false, slideToScroll = 0) {
  const slider = document.querySelector(`[data-slider="${elem}"]`);
  const sliderList = slider.querySelector('.slider__list');
  const sliderSlides = slider.querySelectorAll('.slider__slide');
  const sliderButtonPrev = slider.querySelector('.slider__button-prev');
  const sliderButtonNext = slider.querySelector('.slider__button-next');

  if (pagination) {
    const sliderPagination = slider.querySelector('.slider__pagination');

    for (let i = 0; i < sliderSlides.length; i += 1) {

      const paginationButton = document.createElement('button');
      paginationButton.innerHTML = i + 1;
      paginationButton.classList.add('slider__pagination-button');

      sliderPagination.append(paginationButton);

      paginationButton.onclick = () => {
        sliderList.scrollLeft = i * sliderList.offsetWidth;
      };
    }
  }

  sliderSlides.forEach((slide) => {
    sliderButtonPrev.onclick = () => {
      sliderList.scrollTo({
        left: slide.offsetWidth * (slideToScroll || +slider.computedStyleMap().get('--slider-per-view')[0]) - slide.offsetWidth,
        top: 0,
      });
    };

    sliderButtonNext.onclick = () => {
      sliderList.scrollTo({
        left: slide.offsetWidth * (slideToScroll || +slider.computedStyleMap().get('--slider-per-view')[0]) + slide.offsetWidth,
        top: 0,
      });
    };
  });
}

slider('slider1', true);
