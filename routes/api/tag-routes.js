const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: [{
      model: Product,
      through: ProductTag
    }]
  }).then((tagData) => {
    res.json(tagData);
  }).catch((err) => {
    res.json(err);
  });
});

  // find a single tag by its `id`
  // be sure to include its associated Product data
router.get('/:id', (req, res) => {
  Tag.findByPk(req.params.id, {
    include: [{
      model: Product,
      through: ProductTag
    }]
  }).then((tagData) => {
    res.json(tagData);
  }).catch((err) => {
    res.json(err);
  });
});

  // create a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((newTag) => {
      res.json(newTag)
    })
    .catch((err) => {
      res.json(err);
    });
});

  // update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, { where: { id: req.params.id } })
  .then(() => {
    return Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }]
    });
  })
  .then((updatedTag) => { 
    res.json(updatedTag) 
  })
  .catch((err) => {
    res.json(err);
  })
});

  // delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id:req.params.id,
    },
  })
  .then(() => {
    res.json({  message: "Tag is successfully deleted"});
  })
  .catch((err) => {
    res.json(err);
  });
});

module.exports = router;
