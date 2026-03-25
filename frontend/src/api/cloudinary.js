/**
 * Upload a prescription file (PDF or image) to Cloudinary using unsigned upload preset.
 * Requires in .env:
 *   - VITE_CLOUDINARY_CLOUD_NAME
 *   - VITE_CLOUDINARY_UPLOAD_PRESET (for images; can be same as raw)
 *   - VITE_CLOUDINARY_UPLOAD_PRESET_RAW (optional; for PDFs - use this if PDF upload fails)
 *
 * In Cloudinary: Settings > Upload > Upload presets. For PDFs you need a preset with
 * "Resource type" = "Raw". You can use one preset set to "Raw" for both, or one preset
 * for Image and one for Raw (set VITE_CLOUDINARY_UPLOAD_PRESET_RAW to the Raw preset name).
 *
 * @param {File} file
 * @returns {Promise<string>} secure_url of the uploaded file
 */
export async function uploadPrescriptionFile(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const imagePreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const rawPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_RAW || imagePreset;

  if (!cloudName || !imagePreset) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
  }

  const isPdf = file.type === 'application/pdf';
  const resourceType = isPdf || !file.type.startsWith('image/') ? 'raw' : 'image';
  const uploadPreset = resourceType === 'raw' ? rawPreset : imagePreset;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error?.message || data.error || data.message || `Upload failed: ${res.status}`;
    if (resourceType === 'raw') {
      throw new Error(
        `${message} For PDFs: create an unsigned upload preset with Resource type "Raw" in Cloudinary (Settings > Upload > Upload presets) and set VITE_CLOUDINARY_UPLOAD_PRESET_RAW to that preset name, or use it as your main preset.`
      );
    }
    throw new Error(message);
  }

  return data.secure_url;
}
