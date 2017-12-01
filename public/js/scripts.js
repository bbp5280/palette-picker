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
      projects.forEach(project => {
        buildProject(project);
        addProjectDropdown(project);
      });
      getProjectPalettes(projects);
    })
    .catch(error => console.log(error));
};

const buildProject = (project) => {
  $('.projects-container').append(`<div class='project-details'>
      <h2>${project.project_name}</h2>
      <div class='project-palette-container-${project.id} project-palettes'></div>
    </div>`);
};

const addProjectDropdown = (project) => {
  $('.project-select').append(`<option value='${project.id}'>${project.project_name}</option>`);
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

const buildProjectPalettes = (palettes) => {
  palettes.forEach(palette => {
    $(`.project-palette-container-${palette.project_id}`).append(`
      <div class="aside-palette">
      <p class="palette-name">${palette.name}</p>
      <div class="small-palette-container" id="${palette.id}">
      <div class="small-palettes" style='background-color: ${palette.color_1}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_2}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_3}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_4}'></div>
      <div class="small-palettes" style='background-color: ${palette.color_5}'></div>
      <img src="./assets/trash-icon.png" alt="Delete pallete from project" class="trash-img">
     </div>
     </div>`);
  });
};

const createProject = () => {
  const newProject = $('.project-name-input').val();

  fetch('/api/v1/projects', {
    method:'POST',
    headers:{ 'Content-Type': 'application/json'},
    body: JSON.stringify({ project_name: newProject })
  }).then(response => {
    if ( response.status === 201) {
      return response.json();
    }
  })
    .then(parsedData => {
      buildProject(parsedData);
      addProjectDropdown(parsedData);
    })
    .catch(error => console.log(error));

  $('.project-name-input').val('');
};

const addPalette = () => {
  const palettePostBody = {
    name: $('.palette-name-input').val(),
    project_id: $('.project-select').val(),
    color_1: $('.color-1-text').text(),
    color_2: $('.color-2-text').text(),
    color_3: $('.color-3-text').text(),
    color_4: $('.color-4-text').text(),
    color_5: $('.color-5-text').text()
  };
  fetch(`/api/v1/projects/${palettePostBody.project_id}/palettes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(palettePostBody)
  })
    .then(response => response.json())
    .then(parsedData => buildProjectPalette(parsedData))
    .catch(error => console.log(error));
  $('.palette-name-input').val('');
};

const buildProjectPalette = (palette) => {
  return  $(`.project-palette-container-${palette.id.project_id}`).append(`
      <div class="aside-palette">
      <p class="palette-name">${palette.id.name}</p>
      <div class="small-palette-container" id="${palette.id.id}">
      <div class="small-palettes" style='background-color: ${palette.id.color_1}'></div>
      <div class="small-palettes" style='background-color: ${palette.id.color_2}'></div>
      <div class="small-palettes" style='background-color: ${palette.id.color_3}'></div>
      <div class="small-palettes" style='background-color: ${palette.id.color_4}'></div>
      <div class="small-palettes" style='background-color: ${palette.id.color_5}'></div>
      <img src="./assets/trash-icon.png" alt="Delete pallete from project" class="trash-img">
     </div>
     </div>
     `);
};

const deletePalette = (event) => {
  const paletteId = $(event.target).closest('.small-palette-container').attr('id');
  
  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  })
    .then( () => $(`.${paletteId}`).remove())
    .catch( error => console.log(error));

  $(event.target).closest('.aside-palette').remove();
};

$(document).ready(() => {
  createColorPalette();
  getProjects();
});
$('.new-palette').on('click', createColorPalette);
$('.palette-container').on('click', '.lock-img', (event) => lockColors(event));
$('.submit-project').on('click', createProject);
$('.create-palette-btn').on('click', addPalette);
$('.projects-container').on('click', '.trash-img', (event) => deletePalette(event));
