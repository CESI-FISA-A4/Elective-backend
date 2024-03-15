require('dotenv').config(); // Load env variables

const { initDatabase } = require('./app/utils/initMongoDB');

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const productRoutes = require('./app/routes/productRoutes');
const testRoutes = require('./app/routes/testRoutes');

// const authRoutes = require('./app/routes/authRoutes');

const app = express();

console.log("before initDatabase");
initDatabase();
console.log("after initDatabase");


/** -------------------------------------------Main middlewares----------------------------------------- */
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
/**----------------------------------------------------------------------------------------------------- */


/** -------------------------------------------Authentification----------------------------------------- */
// app.use('/api/auth', authRoutes);

/** -------------------------------------------Products------------------------------------------------- */
app.use('/api/products', productRoutes);
app.use('/api/test', testRoutes);


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/**--------------------------------------------Start server--------------------------------------------- */
const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    process.env.HOST,
    () => {
        console.log(`Server started : ${PORT}`);
    }
)