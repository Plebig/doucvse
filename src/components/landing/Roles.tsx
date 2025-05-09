import Image from "next/image";

const Roles = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <p className="text-sm md:text-base font-semibold text-left self-start mb-2">
          <span className="bg-gradient-to-r from-[#0072FA] via-[#1D0A42] to-[#FF0049] bg-clip-text text-transparent">
            Nemůžeš si vybrat?
          </span>
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-left self-start mb-8">
          Přidej si klidně druhou roli později
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl justify-center items-stretch">
        {/* Student Card */}
        <div className="flex flex-col justify-between border-2 border-[#0072FA] rounded-3xl p-6 w-full lg:w-1/2 bg-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-6">Student</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxBlue.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Dostane se ti okamžité pommoci</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxBlue.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Připravíš se na testy a zkoušky</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxBlue.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Zlepší se ti známky</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/img/landing/StudentBlue.svg"
                alt="Student"
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <button className="bg-[#0072FA] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-full max-w-[200px]">
              Chci se stát studentem
            </button>
            {/* Teacher button will be here */}
          </div>
        </div>

        {/* Teacher Card */}
        <div className="flex flex-col justify-between border-2 border-[#FF0049] rounded-3xl p-6 w-full lg:w-1/2 bg-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-6">Učitel</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxRed.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Pomůžeš ostatním</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxRed.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Zlepšíš své vlastní znalosti v daném předmětu</span>
                </li>
                <li className="flex items-center gap-3">
                  <Image
                    src="/img/landing/CheckBoxRed.svg"
                    alt="check"
                    width={28}
                    height={28}
                  />
                  <span>Přivyděláš si a získáš cenné schopnosti</span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/img/landing/E-LearningRed.svg"
                alt="Teacher"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            {/* Student button is above */}

            <div
              style={{
                background: "linear-gradient(90deg, #FFB3C9 0%, #BF0C3F 100%)",
                padding: "2px",
                borderRadius: "20px",
              }}
              className="w-full max-w-[200px]"
            >
              <button
                className="bg-[#FF0049] text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold shadow-md hover:brightness-110 transition w-full"
                style={{ borderRadius: "18px" }}
              >
                Chci se stát učitelem
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roles;
