import { APIRequest } from './api-request';
import env from '../env';

export class StudioService extends APIRequest {
  create(payload: any) {
    return this.post('/studio/register', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/studio/${id}/update`, payload);
  }

  search(query?: { [key: string]: any }, headers?: any) {
    return this.get(this.buildUrl('/studio/search', query), headers);
  }

  findById(id: string) {
    return this.get(`/studio/${id}/view`);
  }

  updateStudioCommission(id: string, payload: any) {
    return this.put(`/studio/commission/${id}`, payload);
  }

  getUploadDocumentUrl(id?: string) {
    if (id) {
      return `${env.apiEndpoint}/studio/${id}/documents/upload`;
    } else {
      return `${env.apiEndpoint}/studio/documents/upload`;
    }
  }
}

export const studioService = new StudioService();
