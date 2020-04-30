import { createAction } from 'redux-actions';
import { CALL_API } from '../utils/api';

export const fetchCardsAct = createAction('FETCH_CARDS');
export const updateCardAct = createAction('UPATECARDACT');

export function fetchCards(params = {}) {
  return {
    [CALL_API]: {
      act: fetchCardsAct,
      endpoint: `/api/pc/BCard/listBCard`,
      method: 'POST',
      params
    }
  };
}
export function updateCard(params = {}) {
  return {
    [CALL_API]: {
      act: updateCardAct,
      endpoint: `/api/pc/BCard/setDefault`,
      method: 'POST',
      params
    }
  };
}
