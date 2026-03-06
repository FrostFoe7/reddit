import { useMutation } from '@tanstack/react-query';
import { uploadsApi } from '@/services/api';
import { toast } from 'sonner';

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadsApi.uploadImage(file),
    onError: (error: Error) => {
      toast.error(error.message || 'Image upload failed');
    },
  });
}
