exports.seed = function(knex, Promise) {

  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          id: 1,
          project_name: 'Project 1'
        }, 'id')
          .then(project => {
            return knex('palettes').insert([
              {
                id: 1,
                name: 'The thing',
                color_1: '#9495ea',
                color_2: '#eb325d',
                color_3: '#262389',
                color_4: '#5e268d',
                color_5: '#3057c2',
                project_id: project[0]
              },
              {
                id: 2,
                name: 'The other thing',
                color_1: '#b3f815',
                color_2: '#bf93f0',
                color_3: '#c0c280',
                color_4: '#bbe59a',
                color_5: '#895afa',
                project_id: project[0]
              }
            ]);
          })
          .then(project => console.log('seeding complete'))
          .catch(error => console.log(`There was a data seeding error ${ error }`))
      ]);
    })
    .catch(error => console.log(`There was a data seeding error ${ error }`));
};
