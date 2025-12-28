import { ref } from 'vue'

/**
 * A composable that handles file uploads with preview and error handling.
 * Provides reactive state and methods for managing file uploads in the UI.
 * 
 * @returns {Object} File upload state and methods
 * @property {Ref<HTMLInputElement | null>} fileInput - Reference to the file input element
 * @property {Ref<string | null>} fileName - The name of the selected file
 * @property {Ref<string | null>} previewUrl - Object URL for file preview
 * @property {Ref<string | null>} errorMessage - Error message if upload fails
 * @property {Ref<boolean>} pending - Upload in progress state
 * @property {Function} handleFileChange - Handles file selection and upload
 * @property {Function} reset - Resets all state to initial values
 */
export function useFileUploader() {
  const fileInput = ref<HTMLInputElement | null>(null)
  const fileName = ref<string | null>(null)
  const previewUrl = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const pending = ref(false)
  const { uploadFiles } = useDirectusFiles()

  /**
   * Handles file selection and initiates upload.
   * 
   * @param {Event} event - The file input change event
   * @returns {Promise<string | null>} The uploaded file ID or null if upload fails
   * @throws {Error} If the upload fails or no file is selected
   */
  const handleFileChange = async (event: Event): Promise<string | null> => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return null

    fileName.value = file.name
    previewUrl.value = URL.createObjectURL(file)
    errorMessage.value = null
    pending.value = true

    try {
      const uploaded = await uploadFiles(file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      const fileId = Array.isArray(uploaded) ? uploaded[0]?.id : uploaded?.id

      if (!fileId) {
        throw new Error('Upload failed: No file ID returned')
      }

      return fileId
    } catch (err: any) {
      console.error('File upload error:', err)
      
      errorMessage.value = 
        err.data?.errors?.[0]?.message || 
        err.response?._data?.errors?.[0]?.message ||
        err.message ||
        'Failed to upload file'
      
      return null
    } finally {
      pending.value = false
    }
  }

  /**
   * Resets the file upload state to its initial values.
   * Clears the file input, preview, and any error messages.
   */
  const reset = () => {
    fileInput.value = null
    fileName.value = null
    previewUrl.value = null
    errorMessage.value = null
    pending.value = false
  }

  return {
    fileInput,
    fileName,
    previewUrl,
    errorMessage,
    pending,
    handleFileChange,
    reset
  }
}
