export interface PokemonSummary {
  name: string
  url: string
}

export interface PokemonDetailResponse {
  sprites: {
    front_default: string | null,
  }
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonSummary[]
}