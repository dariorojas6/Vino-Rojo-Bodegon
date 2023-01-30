const {Router} = require('express');
const {getFoods, createFood, findById, deleteFood, editFood} = require('../controllers/index');

const router = Router();

// router.get('/', async (req, res) => {
//     try {
//         const foods = await getFoods();
//         res.status(200).json(foods);
//     } catch (error) {
//         res.status(400).send(error)
//     }
// });

router.get("/", async (req, res) => {
    try {
      const { name } = req.query;
      const allFoods= await getFoods();
  
      if (name) {
        const foodName = allFoods.filter((food) =>
          food.name.toLowerCase().includes(name.toLowerCase())
        );
        if (foodName.length > 0) {
          res.status(200).send(foodName);
        } else {
          res.status(400).send("Food not found");
        }
      } else {
        res.status(200).send(allFoods);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.post('/post', async (req, res) => {
    const {name, image, type, description, price} = req.body;
    try {
        await createFood(name, image, type, description, price);
        res.status(200).send('La receta fue añadida');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:idFood', async (req, res) => {
    const {idFood} = req.params;
    try {
        const recipe = await findById(idFood);
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).send('No se encontro la receta');
    }
});

router.delete('/:idFood', async (req, res) => {
    const {idFood} = req.params;
    try {
        await deleteFood(idFood);
        res.status(200).send('La receta fue eliminada correctamente')
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/edit/:idFood', async (req, res) => {
    const {idFood} = req.params;
    const {name, type, description, image, price} = req.body;
    try {
        await editFood(idFood, name, image, description, price, type);
        res.status(200).send('La receta fue actualizada');
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;