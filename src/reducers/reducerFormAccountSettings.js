export default function reducerFormAccountSettings(state, action) {
  switch (action.type) {
    case "HANDLE INPUT":
      return { ...state, [action.field]: action.payload };
    case "CLEAR INPUTS":
      return action.payload;
    default:
      return state;
  }
}
