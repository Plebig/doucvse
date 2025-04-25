"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format, addDays, startOfWeek, subDays, set, isValid } from "date-fns";
import Button from "./ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { chatHrefConstructor } from "@/lib/utils";
import { time } from "console";

interface FormData {
  date: Date;
  timeSlot: string;
  sessionLength: number;
  offerType: string;
  hourlyCost?: number;
  subject: string;
}

interface Props {
  isAuth: boolean;
  partnerId: string;
  sessionId: string;
  amIteacher: boolean;
}

const CreateOffer = ({ isAuth, partnerId, sessionId, amIteacher }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const { control, handleSubmit, setValue } = useForm<FormData>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSessionLength, setSelectedSessionLength] = useState<number | null>(null);
  const [hourlyCost, setHourlyCost] = useState<number | null>();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const isValid =
      selectedDate !== null &&
      selectedTimeSlot !== null &&
      selectedSubject !== null &&
      selectedSubject !== "" &&
      selectedSessionLength !== null &&
      hourlyCost !== null;
    setIsFormValid(isValid);
  }, [
    selectedDate,
    selectedTimeSlot,
    selectedSubject,
    selectedSessionLength,
    hourlyCost,
  ]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`/api/get-teacher`, {
          method: "POST",
          body: JSON.stringify({ teacherId: sessionId }),
        });
        const data = await response.json();
        console.log(data);
        setHourlyCost(data.price);
        setSubjects(data.subjects);
      } catch {
        toast.error("something went wrong. Please try again later");
      }
    };
    fetchTeacher();
  }, []);

  const onSubmit = async (data: FormData) => {
    event?.preventDefault();
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot.");
      return;
    }
    const timeSlotInt = parseInt(data.timeSlot.split(":")[0]);
    data.date.setHours(timeSlotInt);
    data.date.setMinutes(0);
    data.subject = selectedSubject;
    const formattedDate = new Date(data.date).getTime();
    const chatId = chatHrefConstructor(partnerId, sessionId);
    const teacherId = sessionId;
    try {
      toggleModal();
      await fetch("/api/message/send-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          teacherId: teacherId,
          type: "offer",
          date: formattedDate,
          timeSlot: data.timeSlot,
          sessionLength: data.sessionLength,
          hourlyCost: hourlyCost,
          subject: data.subject,
        }),
      });
    } catch {
      toast.error("something went wrong. Please try again later");
    }
  };

  const generateDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const startPreviousWeek = subDays(start, 7);
    const end = addDays(start, 20); // 21 days total (this week + last week + next two weeks)
    const dates = [];
    for (let date = startPreviousWeek; date <= end; date = addDays(date, 1)) {
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 10; hour < 17; hour++) {
      const startTime = `${hour.toString().padStart(2, "0")}:00`;
      timeSlots.push(`${startTime}`);
    }
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Button to Open Modal */}
      <button
        onClick={toggleModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Open Offer Form
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create an Offer</h2>
              <button
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>

            <div className="container max-h-[82vh] overflow-x-auto mx-auto p-4">
              <h1 className="text-3xl font-bold mb-4 text-slate-800">
                Vyberte si termín
              </h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Controller
                    name="date"
                    control={control}
                    defaultValue={new Date()}
                    render={({ field }) => (
                      <div className="grid grid-cols-7 gap-2">
                        <div>Po</div>
                        <div>Út</div>
                        <div>St</div>
                        <div>Čt</div>
                        <div>Pá</div>
                        <div>So</div>
                        <div>Ne</div>
                        {dates.map((date) => {
                          const isDisabled =
                            date < startOfWeek(new Date(), { weekStartsOn: 1 });
                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              onClick={() => {
                                if (!isDisabled) {
                                  setValue("date", date);
                                  setSelectedDate(format(date, "dd.MM.yyyy"));
                                }
                              }}
                              className={`p-2 rounded ${
                                field.value.toDateString() ===
                                date.toDateString()
                                  ? "bg-indigo-600 text-white"
                                  : isDisabled
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-900"
                              }`}
                              disabled={isDisabled}
                            >
                              {format(date, "dd")}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <div>
                    <h2 className="text-lg font-medium mt-4">
                      Selected Date: {selectedDate}
                    </h2>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      Který čas se vám líbí nejvíce?
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setValue("timeSlot", slot);
                            setSelectedTimeSlot(slot);
                          }}
                          className={`p-2 rounded transition-all hover:bg-indigo-300 ${
                            selectedTimeSlot === slot
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-2 rounded transition-all hover:bg-indigo-300 ${
                        selectedSubject.includes(subject)
                          ? "bg-indigo-600 text-indigo-100 px-3 py-1 rounded-full text-sm font-bold"
                          : "bg-indigo-100 text-indigo-500 px-3 py-1 rounded-full text-sm font-bold"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex flex-col items-center justify-between mb-4 w-full">
                    <div className="flex items-center justify-between w-full gap-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedSessionLength(45);
                          setValue("sessionLength", 45);
                        }}
                        variant="indigo"
                        className={`w-full py-2 px-4 rounded-lg text-center font-semibold transition-all ${
                          selectedSessionLength === 45
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900 hover:bg-indigo-300"
                        }`}
                      >
                        45 minut
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedSessionLength(60);
                          setValue("sessionLength", 60);
                        }}
                        variant="indigo"
                        className={`w-full py-2 px-4 rounded-lg text-center font-semibold transition-all ${
                          selectedSessionLength === 60
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900 hover:bg-indigo-300"
                        }`}
                      >
                        60 minut
                      </Button>
                    </div>
                    <div className="flex items-center justify-between w-full gap-4 mt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedSessionLength(90);
                          setValue("sessionLength", 90);
                        }}
                        variant="indigo"
                        className={`w-full py-2 px-4 rounded-lg text-center font-semibold transition-all ${
                          selectedSessionLength === 90
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900 hover:bg-indigo-300"
                        }`}
                      >
                        90 minut
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedSessionLength(120);
                          setValue("sessionLength", 120);
                        }}
                        variant="indigo"
                        className={`w-full py-2 px-4 rounded-lg text-center font-semibold transition-all ${
                          selectedSessionLength === 120
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900 hover:bg-indigo-300"
                        }`}
                      >
                        120 minut
                      </Button>
                    </div>
                  </div>
                  <div>
                    {amIteacher && (
                      <div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Cost
                          </label>
                          <input
                            type="number"
                            name="hourlyCost"
                            id="hourlyCost"
                            step="0.1"
                            defaultValue={hourlyCost!}
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter hourly cost"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              setHourlyCost(value);
                              setValue("hourlyCost", value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isAuth ? (
                  <Button
                    disabled={!isFormValid}
                    type="submit"
                    variant="indigo"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button onClick={toggleModal} type="submit" variant="indigo">
                    <Link href="/login">Submit</Link>
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOffer;
