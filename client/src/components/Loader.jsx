import React from "react";

const Loader = () => {
  return (
    <div className="absolute inset-0 z-50 bg-black/[.1] grid place-items-center">
        <svg
            id="spinnerLoaderRef"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
            width="100"
            height="100"
            overflow="visible"
            fill="#3dabff"
            stroke="none"
            className="single-loader"
        >
            <defs>
                {" "}
                <rect
                    id="spinner"
                    x="46.5"
                    y="45"
                    width="6"
                    height="14"
                    rx="2"
                    ry="2"
                    transform="translate(0 -30)"
                />
            </defs>{" "}
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(0 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(45 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(90 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(135 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(180 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(225 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(270 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>
            <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref="#spinner"
                transform="rotate(315 50 50)"
            >
                <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="0s"
                    begin="0s"
                    repeatCount="indefinite"
                />{" "}
            </use>{" "}
        </svg>
    </div>
  );
};

export default Loader;
