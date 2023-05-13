import React from "react";

const Summary = ({icon, label, value, color}) => {
  return (
    <div className={`rounded-lg p-4 bg-${color}-100 min-w-[180px]`}>
        <div className="flex justify-between gap-6">
            <span className="text-4xl font-semibold">
                {value === undefined ? 0 : value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '1,')}
            </span>
            {icon}
        </div>
        <span className="text-sm">{label}</span>
    </div>  
  );
};

export default Summary;