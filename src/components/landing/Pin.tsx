const Pin = () => {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto flex flex-col gap-10 justify-center items-center">
      <div className="text-left md:self-start">
        <p className="text-sm font-semibold mb-1">
          <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">
            Zaregistruj se ještě dnes ať o nic nepřijdeš!
          </span>
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">
          Co o nás říkají naši uživatelé
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-8 justify-center items-center">
        <img src="/img/landing/Pin1.svg" alt="Pin1" className="w-auto h-auto" />
        <img src="/img/landing/Pin2.svg" alt="Pin2" className="w-auto h-auto sm:-ml-4" />
        <img src="/img/landing/Pin3.svg" alt="Pin3" className="w-auto h-auto sm:col-span-2 xl:col-span-1" />
      </div>
    </section>
  );
};

export default Pin;
