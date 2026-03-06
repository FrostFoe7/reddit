import { api } from '@/api/client';

interface UploadResponse {
  success: boolean;
  url: string;
}

export const uploadsApi = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const result = await api.postForm<UploadResponse>('uploads', formData, { timeout: 60000 });
    return result.url;
  },
};
