import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

import { POKEAPI_BASE_URL } from '../constants'
import { PokemonDetailResponse, PokemonListResponse, PokemonSummary } from 'models'

const router = Router()

router.get('/pokemons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    if (limit < 1 || offset < 0) {
      return res.status(400).json({ error: "Limit must be greater than 0 and offset must be non-negative"})
    }

    const response = await axios.get<PokemonListResponse>(`${POKEAPI_BASE_URL}/pokemon`, {
      params: { limit, offset }
    })

    const pokemonsList = response.data.results

    const detailedPokemonPromises = pokemonsList.map(async (pokemon: PokemonSummary) => {
      try {
        const pokemonDetail = await axios.get<PokemonDetailResponse>(pokemon.url)
        return {
          name: pokemon.name,
          image_url: pokemonDetail.data.sprites.front_default
        }
      } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}: ${error}`)
        return {
          name: pokemon.name,
          image_url: null
        }
      }
    })

    const detailedPokemons = await Promise.all(detailedPokemonPromises)

    res.json({
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: detailedPokemons,
    })
  } catch (error) {
    next(error)
  }
})

export default router