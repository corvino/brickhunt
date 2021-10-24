const { ipcRenderer } = require('electron');
import React, { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react'
import { UploadIcon, PlusCircleIcon } from "@heroicons/react/outline";

const openFile = (event) => {
  ipcRenderer.send("openFile");
}

ipcRenderer.on("buildCreated", (_) => {
  ipcRenderer.send("buildList");
})

function AddBuild(props) {
  let [name, setName] = useState("");
  let [filePath, setFilePath] = useState("");

  ipcRenderer.on("openFile", (_, filePath) => {
    setFilePath(filePath);
  });

  const addBuild = () => {
    ipcRenderer.send("createBuild", {name: name});
  }

  const close = () => {
    setName("");
    props.close();
  }

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      open={props.open}
      onClose={close}>

      <Dialog.Overlay />

      <div className="flex h-screen justify-center items-center">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-200 shadow-xl rounded-2xl">

          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">New Build List</Dialog.Title>

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

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-400 sm:pt-5">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                File
              </label>
              <div className="mt-1 flex rounded-md shadow-sm w-full col-span-2">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <input
                    type="text"
                    name="file"
                    id="file"
                    value={filePath}
                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder=""
                    readOnly
                  />
                </div>
                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  onClick={openFile}
                >
                  <UploadIcon className="h-1 w-1 text-gray-400" aria-hidden="true"/>
                </button>
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
                  onClick={(_) => { addBuild(); close(); }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Dialog>
  )
}

const BuildHeaderItem = (props) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {props.title}
    </th>
  );
}

const PartsTableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <BuildHeaderItem title="Name" />
      </tr>
    </thead>
  );
}

const BuildRow = (props) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {props.name}
      </td>
    </tr>
  );
}

export default () => {
  let [isAddOpen, setIsAddOpen] = useState(false);
  let [builds, setBuilds] = useState([]);

  useEffect(() => {
    ipcRenderer.send("buildList");

    ipcRenderer.on("builds", (_, builds) => {
      setBuilds(builds);
    });
  }, []);

  const closeAdd = () => {
    setIsAddOpen(false);
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="relative w-full h-full">
          <div>
            <button className="absolute w-6 h-6 -right-1 focus:outline-none" onClick={() => { setIsAddOpen(true) }}>
              <PlusCircleIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
            Builds
          </div>

          <div className="flex flex-col mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <PartsTableHeader />
                    <tbody className="bg-white divide-y divide-gray-200">
                      {builds.map(build => (
                        <BuildRow key={build.id} {...build} />
                      ))}
                    </tbody>
                  </table >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddBuild open={isAddOpen} close={closeAdd} />
    </main>
  );
}
