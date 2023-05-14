import React from "react";

const Summary = ({icon, label, value, color}) => {
  return (
    <div className={`rounded-lg p-4 bg-white shadow-md min-w-[180px] max-sm:w-full`}>
        <div className="flex justify-between gap-6 items-center mb-2">
            <span className="text-4xl font-semibold">
                {value === undefined ? 0 : value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '1,')}
            </span>
            <div className={`${color} p-2 rounded-lg`}>
              {icon}
            </div>
        </div>
        <span className="text-sm text-black/[.5]">{label}</span>
    </div>  
  );
};

export default Summary;
