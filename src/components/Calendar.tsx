"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format, addDays, startOfWeek, subDays } from "date-fns";
import Button from "./ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { chatHrefConstructor } from "@/lib/utils";

interface Props {
  isAuth: boolean;
  teacherId: string;
  sessionId: string;
  teacherPrice: number;
  teacherSubjects: string[];
}

interface FormData {
  date: Date;
  timeSlot: string;
  hours: number;
}

const CustomCalendar: React.FC<Props> = ({
  isAuth,
  teacherId,
  sessionId,
  teacherPrice,
  teacherSubjects,
}) => {
  const { control, handleSubmit, setValue } = useForm<FormData>();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "dd.MM"));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number | null>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubject, setSelectedSubjects] = useState<string>("");
  const onSubmit = async (data: FormData) => {
    const formattedDate = new Date(data.date).getTime();
    const chatId = chatHrefConstructor(teacherId, sessionId);
    try {
      await fetch("/api/message/send-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        //chatId, type:"text" date timslot hours
        body: JSON.stringify({
          chatId: chatId,
          teacherId: teacherId,
          type: "request",
          date: formattedDate,
          timeSlot: data.timeSlot,
          hours: selectedHours,
          hourlyCost: teacherPrice,
          subject: selectedSubject,
        }),
      });

      if (message.length > 2) {
        await fetch("/api/message/send", {
          method: "POST",
          body: JSON.stringify({
            chatId: chatId,
            type: "text",
            text: message,
          }),
        });
      }

      toast.success("Offer sent successfully");
      setIsOpen(false);
    } catch {
      toast.error("something went wrong. Please try again later");
    }
    alert(
      `Selected Date: ${format(data.date, "dd.MM")}\nSelected Time Slot: ${
        data.timeSlot
      } and Selected Hours: ${data.hours}`
    );
  };

  // Generate dates for the previous week, this week, and the next two weeks
  const generateDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = addDays(start, 27); // 21 days total (this week + last week + next two weeks)
    const dates = [];
    for (let date = start; date <= end; date = addDays(date, 1)) {
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Generate time slots from 10 AM to 5 PM
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
    <div className="container mx-auto p-4">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Enter Details</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
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
                          const isDisabled = date < subDays(new Date(), 1);
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
                {/* předměty učitele*/}
                {/* předměty učitele*/}
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-700">
                    Vyberte předměty
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {teacherSubjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => setSelectedSubjects(subject)}
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
                </div>
                <div>
                <label className="block mt-3 text-sm font-medium text-gray-700">
                    Jak dlouho by měla trvat lekce?
                  </label>
                  <input
                    type="number"
                    name="hours"
                    id="hours"
                    step="1"
                    defaultValue={1}
                    required
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Zadejte v hodinách jak dlouhá má být lekce"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setSelectedHours(value);
                      setValue("hours", value);
                    }}
                  />
                </div>
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-700">
                    Napište zpávu učiteli
                  </label>
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="text-black w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Ahoj potřebuji doučit vyhovují ti tento termín?"
                  />
                </div>
                <Button
                  variant="indigo"
                  type="submit"
                  className="px-4 py- text-white rounded-md"
                >
                  poslat
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Vyberte si termín
      </h1>
      <div className="space-y-4">
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
                  const isDisabled = date < subDays(new Date(), 1);
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
                        field.value.toDateString() === date.toDateString()
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
        {isAuth ? (
          <Button variant="indigo" onClick={() => setIsOpen(true)}>
            Pokračovat
          </Button>
        ) : (
          <Button type="submit" variant="indigo">
            <Link href="/login">Submit</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
