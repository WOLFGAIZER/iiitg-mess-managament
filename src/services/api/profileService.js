import api from './index';

export const profileService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.put('/users/avatar', formData);
  }
}; 