import { useNavigate } from 'react-router-dom';
import NewPostHeader from '@/components/Community/NewPost/NewPostHeader';
import NewPostForm from '@/components/Community/NewPost/NewPostForm';
import { useNewPost } from '@/hooks/useNewPost';

const NewPostPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData, isFormValid, isSubmitting, submitPost } =
    useNewPost();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const success = await submitPost();
    if (success) {
      navigate('/community');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <NewPostHeader
        onSubmit={handleSubmit}
        isFormValid={isFormValid && !isSubmitting}
      />
      <NewPostForm formData={formData} onChange={setFormData} />

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">글을 등록하는 중...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPostPage;
