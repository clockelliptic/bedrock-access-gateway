'use client';
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { generateDraftPost, newPost } from './actions'
import useSWR from 'swr';
import { getAllAuthors } from './get-all-authors';

export default function NewPost() {
  const { data: authors, isLoading, error } = useSWR('authors', getAllAuthors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    authorId: number
    title: string
    content?: string
  }>()

  const {
    register: registerDraftGeneratorForm,
    handleSubmit: handleSubmitDraftKeywords,
    formState: { errors: draftErrors },
  } = useForm<{
    keywords: string
  }>()

  const router = useRouter()

  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">New Post</h1>
      <div className="max-w-lg  mx-auto">
        <form onSubmit={handleSubmitDraftKeywords(async (data) => {
          const draftContent = await generateDraftPost(data);
          if (draftContent) setValue('content', draftContent);
        })}>
          <div className="flex flex-col mb-4">
            <label className="font-bold" htmlFor="keywords">
              Content draft keywords
            </label>
            <div className="flex items-center gap-2">
              <input
                id="keywords"
                className="p-2 border border-gray-400 rounded-sm flex-1"
                placeholder="software development, AI, ChatGPT"
                {...registerDraftGeneratorForm('keywords')}
              />
              <button type="submit" className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold">
                Generate
              </button>
            </div>
            {draftErrors.keywords && <p className="text-red-500 font-bold">There is a problem with your draft keywords.</p>}
          </div>
        </form>
        <form
          className="flex flex-col gap-4 mx-auto"
          onSubmit={handleSubmit(async data => {
            await newPost(data)
            router.push('/')
          })}
        >
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="author">
              Author
            </label>
            <select disabled={isLoading || error} className="p-2 border border-gray-400 rounded-sm" id="author" {...register('authorId')}>
              {
                authors?.map(author => <option key={author.id} value={author.id}>{author.name}</option>)
              }
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="p-2 border border-gray-400 rounded-sm"
              placeholder="An eye-catching blog post"
              {...register('title', { required: true })}
            />
            {errors.title && <p className="text-red-500 font-bold">Title is required.</p>}
          </div>
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="content">
              Content
            </label>
            <textarea id="content" className="p-2 border border-gray-400 rounded-sm" rows={3} {...register('content')} />
          </div>
          <button type="submit" className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}
