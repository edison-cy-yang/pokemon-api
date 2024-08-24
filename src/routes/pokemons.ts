import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

import { POKEAPI_BASE_URL } from '../constants'

const router = Router()

router.get('/pokemons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    if (limit < 1 || offset < 0) {
      return res.status(400).json({ error: "Limit must be greater than 0 and offset must be non-negative"})
    }

    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
      params: { limit, offset }
    })

    const pokemonsList = response.data.results

    res.json({
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: pokemonsList,
    })
  } catch (error) {
    next(error)
  }
})

export default router