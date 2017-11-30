const generateColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

const createColorPalette = () => {
  for (let i = 1; i < 6; i++){
    if (!$(`.color-${i}`).hasClass('locked')){
      const hexColor = generateColor();
      $(`.color-${i}`).css('background-color', hexColor);
      $(`.color-${i}-text`).text(hexColor);
    }
  }
};

const lockColors = (event) => {
  const target = $(event.target);

  if (target.attr('src') === './assets/unlocked.png') {
    target.attr('src', './assets/locked.png');
    target.closest('.palettes').toggleClass('locked');
  } else {
    target.attr('src', './assets/unlocked.png');
    target.closest('.palettes').toggleClass('locked');
  }
};

const getProjects = () => {
  return fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      buildProjects(projects);
    console.log(projects);
    })
    .catch(error => console.log(error));
};

const buildProjects = (projects) => {
  return projects.forEach(project => {
    return $('.projects-container').append(`<div class='project-details'>
      <h2>${project.project_name}</h2>
    </div>`);
  });
};

const getProjectPalettes = () => {

};


$(document).ready(() => {
  createColorPalette();
  getProjects();
});
$('.new-palette').on('click', createColorPalette);
$('.palette-container').on('click', '.lock-img', (event) => lockColors(event));
