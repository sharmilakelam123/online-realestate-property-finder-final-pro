function Hero() {
  return (
    <div
      className="h-[90vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop')",
      }}
    >

      <div className="bg-black/60 w-full h-full flex items-center justify-center">

        <div className="text-center text-white px-6">

          <h1 className="text-7xl font-bold mb-6">
            Find Your Dream Property
          </h1>

          <p className="text-2xl mb-10">
            Buy, Rent & Sell Properties Easily
          </p>

          <div className="bg-white rounded-2xl p-3 flex w-[900px] max-w-full">

            <input
              type="text"
              placeholder="Search city, locality, landmark..."
              className="flex-1 px-5 py-4 text-black outline-none rounded-xl text-lg"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl text-lg">
              Search
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Hero;