const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    return response.status(200).json(projects);
  })
  .catch(error => {
    return response.status(500).json(error);
  })
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if(palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({
          error: `Could not find and palettes for this project`
        })
      }
    })
    .catch( error => {
      return response.status(500).json({error})
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
