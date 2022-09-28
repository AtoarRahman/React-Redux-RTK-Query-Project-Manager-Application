/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { searched } from "../features/filter/filterSlice";

export default function Search() {
  const dispatch = useDispatch();

  // debounce handler
  const debounce = (fn) => {
    let timer;
    return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            fn.apply(context, args);
        }, 800);
    };
  };

  const handleChange = (value) => {
    dispatch(searched(value));
    // inputRef.current.value = "";
  };

  const inputHandler = useCallback(debounce(handleChange), []);


  return (
    <input
      className="appearance-none rounded-full ml-10 relative block px-3 py-2 border border-slate-700 bg-slate-800 placeholder-gray-500 text-white  focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm focus:bg-slate-600 focus:text-white"
      type="search"
      placeholder="Search for anything…"
      onChange={(e) => inputHandler(e.target.value)}
    />
  )
}
