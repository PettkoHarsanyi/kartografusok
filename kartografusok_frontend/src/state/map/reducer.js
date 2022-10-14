const initialState = {
    name:"map1",
    blocks:64,
    mountains:8,
    treasures:8,
}

export const mapReducer = (state = initialState, action) => {
    const { type, payload } = action;

    return state;
};