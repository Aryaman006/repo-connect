import STATES from "../constant/States";

const getStateById = (id)=> {
    const state = STATES.find(state => state.id === id);
    return state || null; // Return null if state is not found
  }

  export default getStateById;