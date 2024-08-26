import express, { Request, Response, NextFunction } from 'express'
import morgan from "morgan"
import cors, { CorsOptions } from "cors"

import { pokemonRoutes } from './routes'

const app = express()
const port = 8000

const allowedOrigins = ["http://localhost:4200"]

// Configure CORS options
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow requests with no origin
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow if origin is in the allowed list
    } else {
      callback(new Error('Not allowed by CORS')); // Reject if origin is not allowed
    }
  },
  methods: 'GET,POST,PUT,DELETE', // allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions))

app.use(morgan('dev'))
app.use(express.json())

app.use('/api', pokemonRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong')
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});