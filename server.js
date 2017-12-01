//Brings/pulls in express from node_modules
const express = require('express');
//Assigns an new instance of express to app
const app = express();
//Brings/pulls in bodyParser from node_modules
const bodyParser = require('body-parser');
//Brings/pulls in path from node_modules so a path can be set for static content
const path = require('path');

//Sets port to either the enviroment port or to 3000 if none specified
app.set('port', process.env.PORT || 3000);
//Sets the path to static pages loads / path for home page
app.use(express.static(path.join(__dirname, 'public')));
//Sets up body paser as middle ware to parse json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Sets the enviroment to either the diclaired enviroment or dvelopment if unspesified
const environment = process.env.NODE_ENV || 'development';
//Brings/pulls in knexfile and sets configuration based on eviroment specs in the file
const configuration = require('./knexfile')[environment];
//Connects to the proper database based on the above config enviroment
const database = require('knex')(configuration);

//app get request to the projects endpoint
app.get('/api/v1/projects', (request, response) => {
//selects the projects table from the connect database
  database('projects').select()
// returns a response with a status code of 200 and a json object if successful
    .then(projects => {
      return response.status(200).json(projects);
// witll catch errors and return a response of 500 and a json object with error
    }).catch(error => {
      return response.status(500).json(error);
    });
});

//app get request to retrieve pallets for a specific project
app.get('/api/v1/projects/:id/palettes', (request, response) => {
//acccess the palettes table in the db and selects the palettes that match the project ID
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
// if an array with at least one pallet is returned send a response with status of 200 and json object with palletes
      if (palettes.length) {
        return response.status(200).json(palettes);
// if no pallet return a response with a 404 status and a message that there were no palettes for this project
      } else {
        return response.status(404).json({error: `Could not find and palettes for this project`});
      }
// catch errors beyond no pallets and return 500 status
    }).catch(error => {
      return response.status(500).json({error});
    });
});

//app post request to create new projects
app.post('/api/v1/projects', (request, response) => {
// Assigns projects veriable to the request body for the post
  const project = request.body;
//Checks that the body has the required element of name
  if (!project.project_name) {
//If no name respond with status 422 and a message stating name is missing
    return response.status(422).json({error: 'This project is missing a name'});
  }
//access the projects table in the db and inserts request body iton the table. * asks to return all info
  database('projects').insert(project, '*').then(project => {
//If insert is successful return 201 status and respond with all info for request project
    return response.status(201).json(project[0]);
//cat errors and respond with 500
  }).catch(error => {
    return response.status(500).json(error);
  });
});

//app post request to create a palette for a specific project using endpoint
app.post('/api/v1/projects/:id/palettes', (request, response) => {
//Assigns palette variable to request body
  let palette = request.body;
//Assigns project id from request params
  const projectId = request.params.id;
//Validates the request body has all required parameters
  for (let requiredParameter of ['name',
    'color_1',
    'color_2',
    'color_3',
    'color_4',
    'color_5',
    'project_id']) {
// if parameter is missing respond with status of 422 and error message stating the missing property
    if (!palette[requiredParameter]) {
      return response.status(422).json({error: `You are missing the ${requiredParameter} property`});
    }
  }
//update the palette variable to include project id
  palette = Object.assign({}, palette, {project_id: projectId});
//connects to palletts table and inserts the pallet data. * returns all data from table
  database('palettes').insert(palette, '*').then(palette => {
//send response with status 201 and info for palette entered
    return response.status(201).json({id: palette[0]});
//catch errors and return 500 status
  }).catch(error => {
    return response.status(500).json({error});
  });
});

//app delete request to endpoint
app.delete('/api/v1/palettes/:id', (request, response) => {
//assigns id veriable to pallet id from params
  const id  = request.params.id;
//connects to palettes table and deletes where the id matches
  database('palettes').where(id).del()
//if successful respond with  204 status
    .then(palette => {
      if (palette) {
        response.sendStatus(204);
//if pallete with that id does not exist respond with 422 and not found message
      } else {
        response.status(422).json({ error: 'Not Found' });
      }
    })
//catch additional errors and respond with 500 error
    .catch(error => {
      response.status(500).json({ error });
    });
});
//set the app to listen for the correct port and log the server is running.
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
