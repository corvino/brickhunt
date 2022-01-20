import React, { useState } from "react";

const { ipcRenderer } = require("electron");
import { Dialog } from "@headlessui/react";

export default (props) => {
  let [name, setName] = useState("");

  const add = () => {
    ipcRenderer.send("newPlan", {name: name});
  }

  const close = () => {
    setName("");
    props.close();
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto bg-red"
      open={props.open}
      onClose={close}>

      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

      <div className="flex h-screen justify-center items-center">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform ring-1 ring-gray-900 ring-opacity-5 bg-white shadow-xl rounded-2xl">

          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">New Plan</Dialog.Title>

          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(event) => {setName(event.target.value)}}
                  autoComplete="name"
                  className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="pt-5 sm:border-t sm:border-gray-400">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={close}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={(_) => { add(); close(); }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          </div>

        </div>
      </div>
    </Dialog>
  )
}
