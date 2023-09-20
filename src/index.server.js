const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const path =  require('path');
const app = express();
app.use(express.json());


// Setting up router
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')

// To get environment variable
dotenv.config({path: './config.env'})

const PORT = process.env.Port
const DB_URL = process.env.Database

// Connecting to database

 mongoose.connect(DB_URL , 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true
  }
  ).then(()=> console.log('Database connected'))
  .catch((err)=> console.log(err))
  
  
  app.use(cors());
  app.use('/public', express.static(path.join(__dirname, 'uploads')));
  app.use('/api', authRoutes)
  app.use('/api', adminRoutes)
  app.use('/api', categoryRoutes)
  app.use('/api', productRoutes)
  app.use('/api', cartRoutes)
  
app.listen(PORT, () => {
    console.log(`Your app is listening on port ${PORT}`)
})