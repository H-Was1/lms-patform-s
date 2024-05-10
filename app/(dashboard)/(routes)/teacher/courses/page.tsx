import axios from 'axios'

import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { DataTable } from './_component/data-table'
import { columns } from './_component/columns'

const CoursesPage = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage