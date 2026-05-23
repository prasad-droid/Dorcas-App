import React from 'react';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

export const CustomerHomeSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fbff] overflow-hidden">
    <div className="px-5 pt-12 pb-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 relative overflow-hidden"><Shimmer /></div>
          <div>
            <div className="w-24 h-4 bg-white/20 rounded mb-2 relative overflow-hidden"><Shimmer /></div>
            <div className="w-32 h-3 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="w-full h-14 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
    </div>
    <div className="px-5 mt-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 relative overflow-hidden"><Shimmer /></div>
            <div className="w-12 h-3 bg-gray-200 rounded relative overflow-hidden"><Shimmer /></div>
          </div>
        ))}
      </div>
      <div className="w-full h-40 bg-gray-200 rounded-3xl relative overflow-hidden"><Shimmer /></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-14 pb-24 px-5 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="w-10 h-10 bg-white/20 rounded-full relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-10 h-10 bg-white/20 rounded-full relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="px-5 -mt-12 space-y-6">
      <div className="w-full h-32 bg-white rounded-3xl relative overflow-hidden shadow-sm border border-brand/5"><Shimmer /></div>
      <div className="w-full h-40 bg-white rounded-3xl relative overflow-hidden shadow-sm border border-brand/5"><Shimmer /></div>
      <div className="w-full h-48 bg-orange-50 rounded-3xl relative overflow-hidden shadow-sm border border-brand/5"><Shimmer /></div>
    </div>
  </div>
);

export const ListTabSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fbff]">
    <div className="px-6 pt-12 pb-5 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center">
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="flex gap-2 mt-8">
        <div className="flex-1 h-10 bg-white/20 rounded-xl relative overflow-hidden"><Shimmer /></div>
        <div className="flex-1 h-10 bg-white/20 rounded-xl relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="p-5 space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-full h-32 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-12 pb-5 px-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center mb-6">
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="px-6 py-8 space-y-6">
      <div className="w-full h-24 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-full h-16 bg-gray-200 rounded-xl relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);
export const DetailSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-white">
    <div className="w-full h-64 bg-gray-200 relative overflow-hidden"><Shimmer /></div>
    <div className="p-6 space-y-4 -mt-6 bg-white rounded-t-3xl relative z-10">
      <div className="w-1/3 h-6 bg-gray-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="w-2/3 h-8 bg-gray-200 rounded relative overflow-hidden"><Shimmer /></div>
      <div className="w-full h-24 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      <div className="w-full h-40 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc]">
    <div className="pt-16 pb-8 px-6 bg-brand rounded-b-[2.5rem] flex flex-col items-center">
      <div className="w-24 h-24 bg-white/20 rounded-full relative overflow-hidden mb-4"><Shimmer /></div>
      <div className="w-40 h-6 bg-white/20 rounded relative overflow-hidden mb-2"><Shimmer /></div>
      <div className="w-24 h-4 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
    </div>
    <div className="p-6 space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-full h-16 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fbff]">
    <div className="px-5 pt-12 pb-4 bg-brand/5">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-gray-200 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="w-full h-12 bg-gray-200 rounded-2xl relative overflow-hidden mt-4"><Shimmer /></div>
    </div>
    <div className="p-5 grid grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="w-full h-40 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      ))}
    </div>
  </div>
);

export const TechHomeSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-12 pb-5 px-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
          <div>
            <div className="w-24 h-3 bg-white/20 rounded mb-1 relative overflow-hidden"><Shimmer /></div>
            <div className="w-32 h-4 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-white/20 rounded-xl relative overflow-hidden"><Shimmer /></div>
          <div className="w-9 h-9 bg-white/20 rounded-xl relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    </div>
    <div className="px-5 mt-6 space-y-5">
      <div className="w-full h-32 bg-gray-200 rounded-[1.5rem] relative overflow-hidden"><Shimmer /></div>
      <div className="w-full h-56 bg-white border border-gray-100 rounded-[2rem] relative overflow-hidden shadow-sm"><Shimmer /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 h-24 bg-brand/80 rounded-[2rem] relative overflow-hidden"><Shimmer /></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-white border border-gray-100 rounded-[2rem] relative overflow-hidden shadow-sm"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);

export const RewardsSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden pt-12 px-5">
    <div className="flex justify-between items-center mb-6">
      <div className="w-32 h-8 bg-gray-200 rounded-lg relative overflow-hidden"><Shimmer /></div>
      <div className="flex gap-2">
        <div className="w-10 h-10 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="w-20 h-10 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="space-y-6">
      <div className="w-full h-40 bg-gray-200 rounded-3xl relative overflow-hidden"><Shimmer /></div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-[4/5] bg-gray-200 rounded-3xl relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);

export const TechDashboardSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-12 pb-5 px-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center mb-8">
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="flex justify-center -mt-5">
        <div className="w-32 h-6 bg-white/20 rounded-full relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="px-5 mt-10 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);

export const TechEarningsSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-12 pb-5 px-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 bg-white/20 rounded-full relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-10 h-10 bg-white/20 rounded-full relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="px-5 mt-6 space-y-6">
      <div className="w-full h-48 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      <div className="w-full h-20 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);

export const TechCommissionSkeleton = () => (
  <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden">
    <div className="pt-12 pb-5 px-6 bg-brand rounded-b-[2.5rem]">
      <div className="flex justify-between items-center">
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="w-32 h-6 bg-white/20 rounded relative overflow-hidden"><Shimmer /></div>
        <div className="w-11 h-11 bg-white/20 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
    <div className="px-6 pt-8 pb-4 space-y-8">
      <div className="w-full h-48 bg-gray-200 rounded-[2rem] relative overflow-hidden"><Shimmer /></div>
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
        <div className="flex-1 h-12 bg-gray-200 rounded-2xl relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-full h-32 bg-gray-200 rounded-[2rem] relative overflow-hidden"><Shimmer /></div>
        ))}
      </div>
    </div>
  </div>
);
