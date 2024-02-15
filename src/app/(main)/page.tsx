import { BlogPostCard } from "@/components/BlogPost/BlogPostCard";
import Link from "next/link";
import { FaArrowRightLong as SeeAllIcon } from "react-icons/fa6";
import HomepageBlogFilters, {
  type BlogFilter,
} from "./_components/BlogFilters";
import TokenService from "@/services/token";

export default async function Home({
  searchParams,
}: {
  searchParams: { filter: BlogFilter | undefined };
}) {
  const blogsFilter = searchParams.filter;
  const userToken = await TokenService.decodeToken();

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

      <HomepageBlogFilters userToken={userToken} />

      {/* WIP: TRENDING SECTION*/}
      {[undefined, "trending"].includes(blogsFilter) ? (
        <section className="px-24 py-24">
          <h2 className="text-4xl font-semibold text-slate-600">Trending</h2>
          <p className="text-slate-400 mb-12">
            Checkout some of the blog posts that are trending lately!
            <Link
              href="/trending"
              className="ml-2 text-teal-500 inline-flex items-center group"
            >
              See All
              <SeeAllIcon className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-300" />
            </Link>
          </p>

          <div className="grid grid-cols-2 gap-14">
            <BlogPostCard />
            <BlogPostCard />
            <BlogPostCard />
            <BlogPostCard />
          </div>
        </section>
      ) : (
        <div className="p-24 text-center">
          <h2 className="text-2xl font-semibold text-slate-400">
            No blog posts available at this moment.
          </h2>
        </div>
      )}
    </main>
  );
}
