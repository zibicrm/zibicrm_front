import React, { useState } from "react";
import TimeKeeper from "react-timekeeper";

export default function TimePicker({ setShowTime, time, setTime }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" h-[360px] ltr"
    >
      <TimeKeeper
        time={time}
        onChange={(newTime) => setTime(newTime.formatted12)}
        closeOnMinuteSelect={true}
        onDoneClick={() => setShowTime(0)}
        switchToMinuteOnHourSelect
        doneButton={(newTime) => <div style={{ display: "none" }}>Close</div>}
        coarseMinutes={1}
        forceCoarseMinutes
      />
    </div>
  );
}
