import React, {useState, useEffect } from "react";
const { ipcRenderer } = require('electron');

import { Dialog } from '@headlessui/react'
import { XIcon } from "@heroicons/react/outline";

const DesignDetail = (props) => {

  const part = props.part;

  const close = () => {
    props.close();
  }

  return !part ? (<div></div>) : (
    <Dialog as="div" className="fixed inset-0 z-10" open={props.open} onClose={close}>
      <div className="flex h-screen justify-center items-center">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform ring-1 ring-gray-900 ring-opacity-5 bg-white shadow-xl rounded-2xl">

          <button type="button" className="float-right" onClick={close}>
            <XIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="m-auto max-w-[calc(100vw-100px)] max-h-[calc(100vh-100px)] overflow-y-scroll py-4 px-4 sm:px-6 lg:px-8">
            <form className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">

                <div>
                  <div>
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">{part.name}</Dialog.Title>
                  </div>
                </div>

                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Price
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="max-w-lg flex rounded-md shadow-sm">
                        ${part.price}
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label htmlFor="colors" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Colors
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      {part.partColors.map((partColor) => {
                        return (
                          <div key={partColor.id}>
                            <div className="inline-block w-1/6">
                              <img src={partColor.imgURL} className="h-10 w-10"></img>
                            </div>

                            <div className="inline-block w-3/6">
                              {partColor.color.name}
                            </div>

                            <div className="inline-block w-2/6">
                              {partColor.elementId}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>

        </div>
      </div>
    </Dialog>
  )
}

const PartsTableRow = (props) => {
  const part = props.part;
  return (
    <tr onClick={() => { props.showDetail(part) }}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img src={part.partColors[0].imgURL}></img>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {part.designId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {part.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${part.price}
      </td>
    </tr>
  );
}

const PartsTableHeaderItem = (props) => {
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
        <PartsTableHeaderItem title="Image"/>
        <PartsTableHeaderItem title="Design ID"/>
        <PartsTableHeaderItem title="Name"/>
        <PartsTableHeaderItem title="Price"/>
      </tr>
    </thead>
  );
}

function dedupeElements(parts) {
  const uniqueParts = [];
  const elements = new Set();

  parts.forEach(part => {
    if (!elements.has(part.elementId)) {
      uniqueParts.push(part);
      elements.add(part.elementId);
    }
  });

  return uniqueParts;
}

function filterParts(parts, term: string) {
  if (0 === term.length) { return parts; }

  const filteredParts = [];
  const lowercaseTerm = term.toLowerCase();

  parts.forEach((part) => {
    if (part.name.toLowerCase().includes(lowercaseTerm) || String(part.designId).includes(lowercaseTerm)) {
      filteredParts.push(part);
    }
  });

  return filteredParts;
}

const PartsTable = () => {
  let [parts, setParts] = useState([]);
  let [term, setTerm] = useState("");
  let [filteredParts, setFilteredParts] = useState([]);
  let [isDetailOpen, setIsDetailOpen] = useState(false);
  let [detailPart, setDetailPart] = useState(null);

  useEffect(() => {
    ipcRenderer.send("parts");

    ipcRenderer.on("parts", (_, parts) => {
      setParts(parts);
      setFilteredParts(filterParts(parts, term));
    });
  }, []);

  const searchChanged = (event) => {
    setTerm(event.target.value);
    setFilteredParts(filterParts(parts, term));
  }

  function showDetail(part) {
    setDetailPart(part);
    setIsDetailOpen(true);
  }

  const closeDetail = () => {
    setIsDetailOpen(false);
  }

  return (
    <main>
      <div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Search</label>
          <div className="mt-1 h-10 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src="images/Brick1x1.svg" className="h-5 w-5" />
              </div>
              <input type="text" name="email" id="email" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" placeholder="Brick 2x4" value={term} onChange={searchChanged} />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <PartsTableHeader />
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParts.map(part => (
                      <PartsTableRow key={part.designId} part={part} showDetail={showDetail}/>
                    ))}
                  </tbody>
                </table >
              </div>
            </div>
          </div>
        </div>
      </div>

      <DesignDetail open={isDetailOpen} close={closeDetail} part={detailPart} />
    </main>
  );
}

export default PartsTable;
