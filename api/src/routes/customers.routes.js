const jwt = require('jsonwebtoken');
const { Router } = require('express');
const {
  createCustomer,
  getCustomers,
  emailValidation,
  deleteCustomer,
  updateCustomer,
  findCustomerByEmail,
  updateCart,
} = require('../controllers/index');
const bcryp = require('bcryptjs');
const { generatorToken, verifyToken } = require('../auth/auth');

const router = Router();


//Middleware
const tokenValidation = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(400)
      .send('You must provide a token on Authorization header');
  }
  const { id, email } = jwt.verify(
    req.headers.authorization,
    process.env.SECRET_KEY
  );
  const emailIsAuthenticated = email === req.params.email;
  console.log(emailIsAuthenticated)
  if (emailIsAuthenticated) return next();
  return res.status(401).send({
    ok: false,
    message: 'You are not authorized to access this information.',
  });
};



//creacion o registro de customers
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const findCustomer = await findCustomerByEmail(email);
    if (!findCustomer) {
      await createCustomer(name, email, password);
      res.status(200).json({ status: 200, smg: 'Usuario creado' });
    } else {
      res.status(400).json({ status: 400, smg: 'Este correo ya existe' });
    }
  } catch (error) {
    res.status(200).json({ status: 400, error });
  }
});

//Login o inicio de sesion
router.post('/signin', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findCustomerByEmail(email);
    console.log(user);
    //si existe el usuario verifica la contraseña
    if (user) {
      const comparePassword = await bcryp.compare(
        req.body.password,
        user.password
      );
      //si la contraseña es correcta genera el token
      if (comparePassword) {
        const token = generatorToken({ id: user._id, email: user.email, admin: user.admin});
        console.log(token);
        res.send({status: 200, ok: true, message: 'Welcome our app!', token: token, user });
      } else {
        res.send({status: 400, ok:false, message:'password incorrect'});
      }
    } else {
      res.status(400).send({status: 400, ok:false, message:'email incorrect or not exist'});
    }
  } catch (error) {
    console.log(error);
  }
});

//trae todos los customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await getCustomers();
    console.log(customers);
    res.send(customers);
  } catch (error) {
    res.send(error);
  }
});

// router.get('/:email', async (req, res) => {
//   const { email } = req.params;
//   try {
//     let validate = await emailValidation(email);
//     if (validate == true) {
//       return res.status(400).send('Este email ya está en uso');
//     } else if (validate == false) {
//       return res.send('El mail se puede utilizar');
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });
/////// ------>

// router.post('/email', async (req, res) => {
//   const { email } = req.body;
//   try {
//     let validate = await emailValidation(email);
//     if (validate == true) {
//       return res.status(400).send('Este email ya está en uso');
//     } else if (validate ==  false) {
//       return res.send('El mail se puede utilizar');
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });
// router.post('/username', async (req, res) => {
//   const { username } = req.body;
//   try {
//     let validate = await userValidation(username);
//     if (validate == true) {
//       return res.status(400).send('Este usuario ya está en uso');
//     } else if (validate ==  false) {
//       return res.send('El usuario se puede utilizar');
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

router.delete('/:id', async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const { id } = req.params;
  try {
    if(decoded.user.admin === false){
      return res.status(400)
    }
    await deleteCustomer(id);
    res.status(200).send('El usuario fue eliminado');
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    if(decoded.user.admin === false){
      return res.status(400)
    }
    await updateCustomer(id, name, password, email);
    res.status(200).send('La constraseña fue actualizada');
  } catch (error) {
    res.send(error);
  }
});


router.get('/sensibleInformation/:email', verifyToken, (req, res) => {
  return res.send({
    user: req.params.email,
    debit_card_number: '1244 1234 1234 1234',
  });
});

// RUTAS PARA EL CART 
router.put('/updateCart/:id', async (req, res) => {
  const {id} = req.params;
  const {cart, numberCart} = req.body; // --- id: customer._id, cart: [{id, name, image, price}]
  try {
    await updateCart(id, cart, numberCart);
    return res.status(200).send('El carrito fue actualizado')
  } catch (error) {
    res.send(error)
  }
})

router.get('/verifyAdmin', verifyToken, async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  if(decoded.user.admin === true) {
    return res.send('Este user es admin')
  }
  return res.status(400).send('No tienes los permisos necesarios')
});

module.exports = router;
