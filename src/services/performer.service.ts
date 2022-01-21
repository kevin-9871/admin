import { APIRequest } from './api-request';
import env from '../env';
export class PerformerService extends APIRequest {
  create(payload: any) {
    return this.post('/admin/performers', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/performers/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/performers/search', query));
  }

  searchOnline(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/performers/online', query));
  }

  findById(id: string) {
    return this.get(`/admin/performers/${id}/view`);
  }

  getUploadDocumentUrl(id?: string) {
    return `${env.apiEndpoint}/admin/performers/documents/upload`;
  }

  getAvatarUploadUrl() {
    return `${env.apiEndpoint}/admin/performers/avatar/upload`;
  }

  updateCommissionSetting(id: string, payload: any) {
    return this.put(`/admin/performer-commission/${id}`, payload);
  }

  exportCsv(query?: { [key: string]: any }) {
    return (
      env.apiEndpoint +
      this.buildUrl('/admin/performers/export/csv', {
        ...query
      })
    );
  }
}

export const performerService = new PerformerService();
