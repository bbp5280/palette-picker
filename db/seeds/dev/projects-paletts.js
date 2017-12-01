exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())

    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'Project 1'
        }, 'id')
          .then(project => {
            return knex('palettes').insert([
              {
                name: 'Bright',
                color_1: '#e9476d',
                color_2: '#64297f',
                color_3: '#faab5e',
                color_4: '#89d003',
                color_5: '#c7e73a',
                project_id: project[0]
              },
              {
                name: 'Yikes',
                color_1: '#580d88',
                color_2: '#81d644',
                color_3: '#70d59e',
                color_4: '#b6f0f1',
                color_5: '#708409',
                project_id: project[0]
              }
            ]);
          })
          .then(() => console.log('Seeding All Good!'))
          .catch(error => console.log({ error }))
      ]);
    })
    .catch(error => console.log({ error }));
};
