import express, {Express} from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

// Import des routes
import adminRoutes from './routes/AdminRoutes';
import userRoutes from './routes/UserRoutes';
import playlistRoutes from './routes/PlaylistRoutes';
import searchRoutes from './routes/SearchRoutes';

// Swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, {SwaggerOptions} from 'swagger-ui-express';
import {jsDocOptions} from './swagger'

// Database
import {DB_NAME, DB_PASSWORD, DB_USER, SEQUELIZE_DB_PARAMS} from "./config";
import {Sequelize} from "sequelize";
import {Schema} from "./schema";

// Default shorten types for express
export type ReqType = express.Request;
export type ResType = express.Response;

const apiDoc : SwaggerOptions = swaggerJsdoc(jsDocOptions);

// Run the API
const app : Express = express();
app.use(express.json());

// Link swagger component
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

// Session handling for users
app.use(session({
  secret: 'session_secrete',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

// Instantiate the database connection and the models
let _ : Schema = new Schema(new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, SEQUELIZE_DB_PARAMS));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Activate routes
app.use(adminRoutes);
app.use(userRoutes);
app.use(playlistRoutes);
app.use(searchRoutes);

// API startup
app.listen(3000, () => {
  console.log('Server running on : http://localhost:3000');
  console.log('The swagger API is also available at : http://localhost:3000/swagger-ui/')
});
