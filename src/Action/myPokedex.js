const ADD_POKEDEX = 'ADD_POKEDEX'
const REMOVE_POKEDEX = 'REMOVE_POKEDEX'

const initialState = {
  myPokedexes: []
}
 
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_POKEDEX:
      return { 
        ...state,
        myPokedexes: [...state.myPokedexes, action.payload]
      }
    case REMOVE_POKEDEX:
      return {
        ...state,
        myPokedexes: [
          ...state.myPokedexes.filter(myPokedex => myPokedex.id !== action.payload.id)
        ]
      }
    default:
      return state
  }
}
export const addPokedex = data => {
  return {
    type: ADD_POKEDEX,
    payload: data
  }
}

export const removePokedex = data => {
  return {
    type: REMOVE_POKEDEX,
    payload: data
  }
}
