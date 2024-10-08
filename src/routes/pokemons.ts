import { Router, Request, Response, NextFunction } from 'express'
import axios from 'axios'

import { POKEAPI_BASE_URL } from '../constants'
import { PokemonDetailResponse, PokemonListResponse, PokemonSummary } from 'models'

const router = Router()

/**
 * GET /pokemons
 * Fetches a list of Pokémon with optional pagination.
 *
 * @route GET /pokemons
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} A list of Pokémon including basic and detailed information.
 */
router.get('/pokemons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const perPage = parseInt(req.query.perPage as string) || 50
    const page = parseInt(req.query.page as string) || 0

    if (page < 1 || perPage < 0) {
      return res.status(400).json({ error: "page and perPage must be great than 0"})
    }

    const offset = (page - 1) * perPage
    const limit = perPage

    const response = await axios.get<PokemonListResponse>(`${POKEAPI_BASE_URL}/pokemon`, {
      params: { limit, offset }
    })

    const pokemonsList = response.data.results

    // Take the response and query the pokemon detail endpoint
    const detailedPokemonPromises = pokemonsList.map(async (pokemon: PokemonSummary) => {
      try {
        const pokemonDetail = await axios.get<PokemonDetailResponse>(pokemon.url)
        return {
          id: pokemonDetail.data.id.toString(),
          name: pokemon.name,
          image_url: pokemonDetail.data.sprites.front_default
        }
      } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}: ${error}`)
        return {
          id: null,
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