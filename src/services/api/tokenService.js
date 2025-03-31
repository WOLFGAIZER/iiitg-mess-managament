import api from './index';

export const tokenService = {
  getTokens: () => api.get('/tokens'),
  buyToken: (data) => api.post('/tokens/buy', data),
  verifyToken: (tokenId) => api.post(`/tokens/verify/${tokenId}`),
  getHistory: () => api.get('/tokens/history')
}; 