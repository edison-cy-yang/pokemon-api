export interface PokemonSummary {
  id: number,
  name: string
  url: string
}

export interface PokemonDetailResponse {
  sprites: {
    front_default: string | null,
  }
  id: number,
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonSummary[]
}