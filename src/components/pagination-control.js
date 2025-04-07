'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { PAGE, PER_PAGE } from '@/lib/pagination'
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";


function PaginationControls({ hasNextPage, hasPrevPage, total }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') ?? PAGE)
  const per_page = Number(searchParams.get('per_page') ?? PER_PAGE)
  const category = searchParams.get('category') ?? ''

  return (
    <div className='flex justify-between items-center gap-2'>
      <button
        className='flex gap-1 items-center bg-blue-500 text-white p-2 rounded-md disabled:bg-slate-300'
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`?page=${page - 1}&category=${category}`)
        }}>
        <ChevronLeftIcon /> prev page
      </button>

      <div className='flex-grow text-center'>
        {page} / {Math.ceil(total / per_page)}
      </div>

      <button
        className='flex gap-1 items-center bg-blue-500 text-white p-2 rounded-md disabled:bg-slate-300'
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`?page=${page + 1}&category=${category}`)
        }}>
        next page <ChevronRightIcon />
      </button>
    </div>
  )
}

export default PaginationControls
