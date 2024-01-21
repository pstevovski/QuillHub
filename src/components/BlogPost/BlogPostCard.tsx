"use client";

import cn from "@/utils/classnames";
import Link from "next/link";
import { useState } from "react";

// Icons
import { FaHeart as LikeIcon } from "react-icons/fa";
import {
  FaBookmark as BookmarkIcon,
  FaArrowRightLong as ReadMoreIcon,
} from "react-icons/fa6";

function BlogPostCardTitle({
  title,
  author,
  date,
}: {
  title: string;
  author: string;
  date: string;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold">{title}</h3>
      <h6 className="text-xs text-slate-400 font-light">
        <em>
          by {author}, <span>{date}</span>
        </em>
      </h6>
    </div>
  );
}

function BlogPostCardActions({
  id,
  is_liked,
  is_bookmarked,
}: {
  id: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}) {
  const [isLiked, setIsLiked] = useState<boolean>(is_liked);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(is_bookmarked);

  const handleBlogPostLike = () => {
    // todo: send API request
    setIsLiked(!isLiked);
    console.log(`Blog post with ID ${id} like action`);
  };

  const handleBlogPostBookmark = () => {
    // todo: send API request
    setIsBookmarked(!isBookmarked);
    console.log(`Blog post with ID ${id} bookmark action`);
  };

  return (
    <div className="flex items-center">
      <LikeIcon
        className={cn(
          "text-slate-300 text-2xl mx-4 hover:text-rose-500 duration-300 cursor-pointer hover:scale-125",
          isLiked ? "text-rose-500" : ""
        )}
        onClick={handleBlogPostLike}
      />
      <BookmarkIcon
        className={cn(
          "text-slate-300 text-2xl hover:text-teal-500 duration-300 cursor-pointer hover:scale-125",
          isBookmarked ? "text-teal-500" : ""
        )}
        onClick={handleBlogPostBookmark}
      />
    </div>
  );
}

// todo: Connect with real data
export function BlogPostCard() {
  return (
    <div className="border w-full rounded-md col-span-12 lg:col-span-1">
      <div className="flex items-center justify-center p-6 h-64 bg-slate-100">
        <h1>Image</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {/* title & author */}
          <BlogPostCardTitle title="Test" author="abc" date="123" />

          {/* like & bookmark icons */}
          <BlogPostCardActions id={1} is_liked={false} is_bookmarked={true} />
        </div>
        <p className="mb-8">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non totam
          dolores explicabo laboriosam provident veniam rem optio cupiditate
          pariatur, accusamus omnis sunt veritatis facilis amet libero? Tempora
          quibusdam consequatur vero!
        </p>

        <Link href="/" className="py-2 flex items-center group font-semibold">
          <span className="group-hover:text-teal-500 duration-200">
            Read More
          </span>
          <ReadMoreIcon className="opacity-0 group-hover:text-teal-500 group-hover:opacity-100 group-hover:translate-x-2 duration-200" />
        </Link>
      </div>
    </div>
  );
}
