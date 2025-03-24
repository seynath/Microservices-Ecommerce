
const Newsletter = () => {
  return (
    <>
    <section>
		  {/* Container */}
		  <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:px-10 md:py-18 lg:px-12 lg:py-20">
		    {/* Component */}
		    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 lg:gap-16 bg-gray-100 p-8 sm:p-10 md:p-12">
		      {/* Image */}
		      <img src="https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPLaceholder%20Image%20Secondary.svg?alt=media&token=b8276192-19ff-4dd9-8750-80bc5f7d6844" alt="" className="inline-block h-72 w-72 object-cover" />
		      <div className="max-w-2xl flex-1">
		        {/* Title */}
		        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
		          Join the Flowspark Community
		        </h2>
		        <p className="mb-6 text-sm text-gray-500 sm:text-base md:mb-10 lg:mb-12">
		          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
		          aliquam, purus sit amet luctus venenatis, lectus magna fringilla
		          urna
		        </p>
		        {/* Form */}
		        <div className="mb-4 flex">
		          <form name="email-form" method="get" className="flex w-full flex-col gap-3 sm:flex-row">
		            <input type="email" className="h-9 w-full rounded-md border border-solid border-black px-3 py-6 text-sm text-gray-500 placeholder:text-gray-500" placeholder="Enter your email" />
		            <input type="submit" value="Notify me" className="cursor-pointer rounded-md bg-black px-6 py-2 font-semibold text-white" />
		          </form>
		        </div>
		      </div>
		    </div>
		  </div>
		</section>
    </>
  )
}

export default Newsletter