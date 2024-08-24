import express, { Request, Response, NextFunction } from 'express'
import morgan from "morgan"

import { pokemonRoutes } from './routes'

const app = express()
const port = 8000

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