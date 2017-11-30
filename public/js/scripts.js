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


$(document).ready(createColorPalette);
$('.new-palette').on('click', createColorPalette);
