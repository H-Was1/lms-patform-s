import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import { ImageForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/imageForm";
import { CategoryForm } from "./_components/Categoryform";
import PriceForm from "./_components/priceForm";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChaptersForm } from "./_components/ChapterForm";

const Page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) return redirect("/");

  //   ---------------------------------------------------

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.price,
    course.imageUrl,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm">Complete all fields {completionText}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge
              Icon={LayoutDashboard}
              //   iconVariant={""}
              variant={"success"}
              size={"small"}
            />
            <h2>Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />

          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge
                Icon={ListChecks}
                //   iconVariant={""}
                variant={"success"}
                size={"small"}
              />
              <h2>Course chapters</h2>
            </div>
            {/* <div className="">TODO: Chapters</div> */}
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge
                Icon={CircleDollarSign}
                //   iconVariant={""}
                variant={"success"}
                size={"small"}
              />
              <h2>Sell your Course.</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div className="">
            <div className="flex items-center gap-x-2">
              <IconBadge
                Icon={File}
                //   iconVariant={""}
                variant={"success"}
                size={"small"}
              />
              <h2>Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
