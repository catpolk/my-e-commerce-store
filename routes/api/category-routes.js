const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

    // find all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: [Product]
  }).then((categoryData) => {
    res.json(categoryData);
  }).catch((err) => {
    res.json(err);
  });
});

  // find one category by its `id` value
router.get('/:id', (req, res) => {
  Category.findByPk(req.params.id, {
    include: [Product]
  }).then((categoryData) => {
    res.json(categoryData);
  }).catch((err) => {
    res.json(err);
  });
});

//Create a category
router.post('/', (req, res) => {
  Category.create(req.body)
    .then((newCategory) => {
      res.json(newCategory)
    })
    .catch((err) => {
      res.json(err);
    });
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  Category.update(
    {
      // All the fields can be updated and the data attached to the request body.
      id:req.body.id,
      category_name:req.body.category_name,
    },
    // Gets the category based on the id given in the request parameters
    {
      where: {
        id: req.params.id,
      },
    }
  ).then((updatedCategory) => {
    // Sends the updated book as a json response
    res.json(updatedCategory);
  })
  .catch((err) => res.json(err));
});

  // delete a category by its `id` value
router.delete('/:id', (req, res) => {
  // Looks for categories based on id given in the request parameters and deletes the instance from the database
  Category.destroy({
    where: {
      id:req.params.id,
    },
  })
  .then((deletedCategory) => {
    res.json(deletedCategory);
  })
  .catch((err) => res.json(err));
});


module.exports = router;
