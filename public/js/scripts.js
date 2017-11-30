const generateColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const createColorPalette = () => {
  for (let i = 1; i < 6; i++){
    const randomHexColor = generateColor();
    $(`.color-${i}`).css('background-color', randomHexColor);
    $(`.color-${i}-text`).text(randomHexColor);
  }
};

const lockColors = (e) => {
    const src = $(e.target)

    if(src.attr('src') === './assets/unlocked.png') {
        src.attr('src', './assets/locked.png')
        src.closest('.palettes').toggleClass('locked')
    } else {
        src.attr('src', './assets/unlocked.png')
        src.closest('.palettes').toggleClass('locked')
    }
};


$(document).ready(createColorPalette);
$('.new-palette').on('click', createColorPalette);
$('.palette-container').on('click', '.lock-img', (e) => lockColors(e));
