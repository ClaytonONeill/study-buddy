// Modules
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="mt-10 text-center text-4xl font-bold tracking-tight text-black">
            Welcome to Study Buddy!
          </h1>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-black"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-black"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base text-white outline-2 -outline-offset-1 outline-black placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"
                // onClick={handleSignin()} TODO: Build out this function to sign in
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-lg text-slate-600">
            Not a member?
          </p>
          <Link to="/signup">
            <button className="bg-green-500 text-white py-2 px-4 rounded flex m-auto mt-2 hover:bg-green-600 cursor-pointer">
              Sign up here
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
