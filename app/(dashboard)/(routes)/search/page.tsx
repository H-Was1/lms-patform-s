import { db } from "@/lib/db";
import React from "react";
import Categories from "./_component/Categories";
import { SearchInput } from "@/components/searchInput";
import { auth } from "@clerk/nextjs/server";
import { getCourses } from "@/actions/get-courses";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

const page = async ({
  searchParams,
}: {
  searchParams: {
    title: string;
    categoryId: string;
  };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const courses = await getCourses({ userId, ...searchParams });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default page;
