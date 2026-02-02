import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="absolute top-2 right-2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-full"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mt-1"></div>
          </div>
        </div>
      ))}
    </>
  );
};

interface CategorySkeletonProps {
  count?: number;
}

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col items-center text-center p-4 cursor-pointer">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-3"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      ))}
    </>
  );
};

interface FashionCardSkeletonProps {
  count?: number;
}

export const FashionCardSkeleton: React.FC<FashionCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg mb-3">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-full"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      ))}
    </>
  );
};

interface HeroSkeletonProps {}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = () => {
  return (
    <div className="relative h-96 bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded animate-pulse w-96 mx-auto mb-6"></div>
          <div className="h-10 bg-gray-300 rounded animate-pulse w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

interface TabSkeletonProps {
  count?: number;
}

export const TabSkeleton: React.FC<TabSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
