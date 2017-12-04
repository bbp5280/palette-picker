const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      return response.status(200).json(projects);
    }).catch(error => {
      return response.status(500).json(error);
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({error: `Could not find and palettes for this project`});
      }
    }).catch(error => {
      return response.status(500).json({error});
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if (!project.project_name) {
    return response.status(422).json({error: 'This project is missing a name'});
  }
  database('projects').insert(project, '*').then(project => {
    return response.status(201).json(project[0]);
  }).catch(error => {
    return response.status(500).json(error);
  });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const projectId = request.params.id;
  for (let requiredParameter of ['name',
    'color_1',
    'color_2',
    'color_3',
    'color_4',
    'color_5',
    'project_id']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({error: `You are missing the ${requiredParameter} property`});
    }
  }
  palette = Object.assign({}, palette, {project_id: projectId});
  database('palettes').insert(palette, '*').then(palette => {
    return response.status(201).json({id: palette[0]});
  }).catch(error => {
    return response.status(500).json({error});
  });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const id  = request.params.id;
  database('palettes').where(id).del()
    .then(palette => {
      if (palette) {
        response.sendStatus(204);
      } else {
        response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
