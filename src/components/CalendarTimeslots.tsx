"use client";
import React, { useState } from "react";
import { format, addDays, startOfWeek, subDays } from "date-fns";
import { useForm, Controller } from "react-hook-form";

interface Props {
  onOptionSelected: (date: number, time: string) => void;
}

const CalendarTimeslots = ({onOptionSelected} : Props) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const generateDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = addDays(start, 27);
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
    <div>
      <div>
        <Controller
          name="date"
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
                        setSelectedDate(date.getTime());
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
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => {
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
      <button
        onClick={() => {
          if (selectedDate && selectedTimeSlot) {
            onOptionSelected(selectedDate, selectedTimeSlot);
          }
        }}
        className="p-2 bg-indigo-600 text-white rounded mt-4">
          Poslat
        </button>
    </div>
  );
};

export default CalendarTimeslots;
