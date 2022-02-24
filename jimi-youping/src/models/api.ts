import type { Effect, Reducer } from 'umi';

import { getConfig } from '@/services/api';
import type { getConfigResponse } from '@/services/data.d.ts';

export type State = {
  config: getConfigResponse;
};

export type Model = {
  namespace: 'api';
  state: State;
  effects: {
    getConfig: Effect;
  };
  reducers: {
    config: Reducer<State>;
  };
};

const model: Model = {
  namespace: 'api',

  state: {
    config: {
      /* 4M: 1024 ** 2 * 4 */ upload_max_size: 4194304,
    },
  },

  effects: {
    *getConfig(action, { call, put }) {
      const response = yield call(getConfig, {
        field: action.payload.join(),
      });

      yield put({
        type: 'config',
        payload: response,
      });
    },
  },

  reducers: {
    config(state, action) {
      return {
        ...state,
        config: action.payload || state?.config || {},
      };
    },
  },
};

export default model;
