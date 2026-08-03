import { supabase, hasSupabaseConfig } from '@/lib/supabaseClient';

export class PartnerStorageService {
  private static AVATAR_BUCKET = 'partner-avatars';
  private static PROOF_BUCKET = 'partner-proofs';

  /**
   * Uploads a partner profile photo file to Supabase Storage bucket 'partner-avatars'
   */
  public static async uploadPartnerAvatar(file: File | Blob, partnerId: string): Promise<string> {
    if (!hasSupabaseConfig) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.type.split('/')[1] || 'jpg';
      const filePath = `${partnerId}/avatar-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(this.AVATAR_BUCKET)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(this.AVATAR_BUCKET)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Failed uploading avatar. Falling back to local preview.', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Uploads a channel proof screenshot file to Supabase Storage bucket 'partner-proofs'
   */
  public static async uploadPartnerProofScreenshot(file: File | Blob, partnerId: string, platformName: string): Promise<string> {
    if (!hasSupabaseConfig) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const cleanPlatform = platformName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const fileExt = file.type.split('/')[1] || 'png';
      const filePath = `${partnerId}/${cleanPlatform}-proof-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(this.PROOF_BUCKET)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(this.PROOF_BUCKET)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Failed uploading proof screenshot. Falling back to local preview.', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
}
