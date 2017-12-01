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
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      buildProjects(projects);
      getProjectPalettes(projects);
      projectsDropdown(projects);
    })
    .catch(error => console.log(error));
};

const buildProjects = (projects) => {
  projects.forEach(project => {
    $('.projects-container').append(`<div class='project-details'>
      <h2>${project.project_name}</h2>
      <div class='project-palette-container-${project.id} project-palettes'></div>
    </div>`);
  });
};

const projectsDropdown = (projects) => {
  projects.forEach(project => {
    $('.project-select').append(`<option value=${project.id}>${project.project_name}</option>`);
  });
};

const getProjectPalettes = (projects) => {
  projects.forEach(project => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => {
        buildProjectPalettes(palettes);
      }
      )
      .catch(error => console.log(error));
  });
};

const buildProjectPalettes = (palettes, project) => {
  palettes.forEach(palette => {
    $(`.project-palette-container-${palette.project_id}`).append(`
      <p class="palette-name">${palette.name}</p>
      <div class="small-palette-container">
      <div class="small-palettes" style='background-color: ${palette.color_1}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_2}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_3}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_4}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_5}'></div>
    </div>`);
  });
};


$(document).ready(() => {
  createColorPalette();
  getProjects();
});
$('.new-palette').on('click', createColorPalette);
$('.palette-container').on('click', '.lock-img', (event) => lockColors(event));
