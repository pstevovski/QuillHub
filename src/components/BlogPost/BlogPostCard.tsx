import Link from "next/link";

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
          <div className="flex items-center">
            <LikeIcon className="text-slate-300 text-2xl mx-4 hover:text-rose-500 duration-300 cursor-pointer" />
            <BookmarkIcon className="text-slate-300 text-2xl hover:text-teal-500 duration-300 cursor-pointer" />
          </div>
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
