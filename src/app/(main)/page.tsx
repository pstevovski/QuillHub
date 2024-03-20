import Link from "next/link";

// Assets
import { FaHeart as LikeIcon } from "react-icons/fa";
import {
  FaBookmark as BookmarkIcon,
  FaArrowRightLong as ReadMoreIcon,
} from "react-icons/fa6";
import cn from "@/utils/classnames";
import Search from "../../components/Search/Search";
import fetchHandler from "@/utils/fetchHandler";
import constructSearchParams from "@/utils/constructSearchParams";
import { format } from "date-fns";

interface SearchParams {
  search: string | undefined;
  limit: number | undefined;
  page: number | undefined;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = constructSearchParams(searchParams);
  const blogs = await fetchHandler("GET", `blog${params}`);

  return (
    <main>
      {/* CTA section */}
      <section className="px-24 py-48 flex flex-col items-center justify-center text-center">
        <h1 className="text-[64px] font-bold">QuillHub</h1>
        <p className="text-slate-500 mb-12 text-sm">
          <em>Unfold Your Imagination, Share Your Universe</em>
        </p>

        <p className="text-slate-500 mb-4">
          Welcome to QuillHub, where your words come to life and your stories
          find their wings. 🚀
        </p>

        <p className="text-slate-500 mb-12">
          Ready to embark on a journey of self-expression and connection?
          <br />
          Join QuillHub today and start weaving your stories into the fabric of
          our vibrant literary community.
          <br />
          <span className="text-slate-500 font-semibold">
            <em>Your words matter, and here, they find their home</em>
          </span>
        </p>

        <Link
          href="/post/create"
          className="w-48 rounded-md p-3 bg-teal-500 text-white font-medium text-md hover:shadow-xl duration-200"
        >
          Start Writing!
        </Link>
      </section>

      <div className="max-w-sm mb-6">
        <Search />
      </div>

      <section className="grid grid-cols-3 gap-14">
        {blogs.results && blogs.results.length > 0 ? (
          blogs.results.map((post: any) => (
            <div
              key={post.id}
              className="border w-full rounded-md col-span-12 lg:col-span-1"
            >
              <div className="flex items-center justify-center h-64 bg-slate-100">
                {post.cover_photo ? (
                  <img
                    className="h-64 w-full rounded-t-md object-fill"
                    src={post.cover_photo}
                    alt="Cover Photo"
                  />
                ) : (
                  <h1>PLACEHOLDER COVER PHOTO</h1>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  {/* title & author */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <h6 className="text-xs text-slate-400 font-light">
                      <em>
                        by {post.first_name} {post.last_name},{" "}
                        <span>{`${format(
                          new Date(post.created_at),
                          "MM/dd/yyyy HH:mm"
                        )}`}</span>
                      </em>
                    </h6>
                  </div>

                  {/* like & bookmark icons */}
                  <div className="flex items-center">
                    <LikeIcon
                      className={cn(
                        "text-slate-300 text-2xl mx-4 hover:text-rose-500 duration-300 cursor-pointer hover:scale-125"
                      )}
                    />
                    <BookmarkIcon
                      className={cn(
                        "text-slate-300 text-2xl hover:text-teal-500 duration-300 cursor-pointer hover:scale-125"
                      )}
                    />
                  </div>
                </div>
                <p className="mb-8">{post.content}</p>

                <Link
                  href={`/post/${post.id}`}
                  className="py-2 flex items-center group font-semibold"
                >
                  <span className="group-hover:text-teal-500 duration-200">
                    Read More
                  </span>
                  <ReadMoreIcon className="opacity-0 group-hover:text-teal-500 group-hover:opacity-100 group-hover:translate-x-2 duration-200" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h1>No blog post data available.</h1>
        )}
      </section>
    </main>
  );
}
