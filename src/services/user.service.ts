import { APIRequest, IResponse } from './api-request';
import { IUser } from 'src/interfaces';
import env from '../env';
import { authService } from '@services/index';

export class UserService extends APIRequest {
  me(headers?: { [key: string]: string }): Promise<IResponse<IUser>> {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    return this.put('/users', payload);
  }

  create(payload: any) {
    return this.post('/admin/users', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/users/${id}`, payload);
  }

  getAvatarUploadUrl(userId?: string) {
    if (userId) {
      return `${env.apiEndpoint}/admin/users/${userId}/avatar/upload`;
    }
    return `${env.apiEndpoint}/users/avatar/upload`;
  }

  uploadAvatarUser(file: File, userId?: string) {
    return this.upload(`/admin/users/${userId}/avatar/upload`, [
      { file, fieldname: 'avatar' }
    ]);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/users/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/users/${id}/view`);
  }

  exportCsv(query?: { [key: string]: any }) {
    return (
      env.apiEndpoint +
      this.buildUrl('/admin/users/export/csv', {
        ...query
      })
    );
  }
}

export const userService = new UserService();
