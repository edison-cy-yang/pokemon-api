import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

import { POKEAPI_BASE_URL } from '../constants'

const router = Router()

router.get('/pokemons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=100`)

    const pokemonsList = response.data.results

    res.json(pokemonsList)
  } catch (error) {
    next(error)
  }
})

export default router