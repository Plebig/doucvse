import TeacherCard from "@/components/TeacherCard";
import { getAllTeachers } from "@/helpers/get-all-teachers";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import { takeCoverage } from "v8";

const DashboardPage = async ({ searchParams }: any) => {

  return (
    <div className="container py-12 flex flex-col gap-y-4 overflow-y-scroll">
      dashboard
    </div>
  );
};

export default DashboardPage;
