export default function ErrorPage() {
    return <div className="flex justify-center items-center m-2 border h-[98lvh] rounded-md">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-medium">
          Something went wrong!!        
        </h1>
        <a href="/" className="hover:underline">
            Go back to home page
        </a>
      </div>

    </div>
  }