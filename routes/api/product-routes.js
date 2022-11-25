const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
  // find all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [Category, { 
      model: Tag, 
      through: ProductTag,
    }]
  }).then((productData) => {
    res.json(productData);
  })
  .catch((err) => {
    res.json(err);
  });
});

// get one product
  // find a single product by its `id`
router.get('/:id', (req, res) => {
  Product.findByPk(req.params.id, {
    include: [Category, { 
      model: Tag, 
      through: ProductTag,
    }]
  }).then((productData) => {
    res.json(productData);
  }) .catch((err) => {
    res.json(err);
  });
});

// create new product
router.post('/', (req, res) => {
  Product.create(req.body) (
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  )
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  const { id, product_name, price, stock, category_id } = req.body;
  Product.update({
    id,
    product_name,
    price, 
    stock,
    category_id
  },
  {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((deletedProduct) => {
    res.json(deletedProduct);
  })
  .catch((err) => res.json(err));
});

module.exports = router;
