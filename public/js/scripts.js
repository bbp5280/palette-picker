const generateColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const createColorPalette = () => {
  for (let i = 1; i < 6; i++){
    if(!$(`.color-${i}`).hasClass('locked')){
    const hexColor = generateColor();
    $(`.color-${i}`).css('background-color', hexColor);
    $(`.color-${i}-text`).text(hexColor);
  }
 }
};

const lockColors = (e) => {
    const target = $(e.target)

    if(target.attr('src') === './assets/unlocked.png') {
        target.attr('src', './assets/locked.png')
        target.closest('.palettes').toggleClass('locked')
    } else {
        target.attr('src', './assets/unlocked.png')
        target.closest('.palettes').toggleClass('locked')
    }
};


$(document).ready(createColorPalette);
$('.new-palette').on('click', createColorPalette);
$('.palette-container').on('click', '.lock-img', (e) => lockColors(e));
