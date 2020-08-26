import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import contestReducer from './reducers/contestReducers'
import leaderboardReducer from './reducers/leaderboardReducers'
import personalSubmissionsReducer from './reducers/personalSubmissionsReducer'
import submissionsReducer from './reducers/submissionsReducer'
import questionsReducer from './reducers/questionsReducer'
import editorialReducer from "./reducers/editorialReducer"

// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from "redux-devtools-extension";

// const persistConfig = {
//     key: 'authType',
//     storage: storage,
//     // whitelist: // which reducer want to store
// };

// const initialState = {};
const middleware = [thunk];
const rootReducer = combineReducers({ questionsReducer,contestReducer, leaderboardReducer,submissionsReducer, personalSubmissionsReducer, editorialReducer });

// const pReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;