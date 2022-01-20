import React, { useEffect, useState } from "react";

import { HeaderItem, Table, TD } from "../Common/Table";

const { ipcRenderer } = require("electron");
import { Dialog } from "@headlessui/react";

const TableHeader = () => {
  return (
    <tr>
      <HeaderItem>Name</HeaderItem>
    </tr>
  );
}

const TableBody = (props) => {
  const items = props.builds;

  if (0 < items.length) {
    return (
      <>
        {items.map((item, index) => (
          <tr
            className = {props.selectedBuilds.includes(index) ? "bg-red-500" : ""}
            onClick={() => { props.toggleSelection(index) }}
            key={item.id}>
              <TD>{item.name}</TD>
          </tr>
        ))}
      </>
    );
  }
}

export default (props) => {
  let [name, setName] = useState("");
  let [builds, setBuilds] = useState([]);
  let [selectedBuilds, setSelectedBuilds] = useState([]);

  useEffect(() => {
    ipcRenderer.send("buildList");

    ipcRenderer.on("builds", (_, builds) => {
      setBuilds(builds);
    });
  }, []);

  const add = () => {
    ipcRenderer.send("newPlan", {name: name});
  }

  const toggleSelection = (id) => {
    if (selectedBuilds.includes(id)) {
      setSelectedBuilds(selectedBuilds.filter(x => x !== id));
    } else {
      setSelectedBuilds(selectedBuilds.concat([id]));
    }
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

          <Dialog.Title className="text-lg font-medium leading-6 text-gray-700">Add Build</Dialog.Title>

          {0 < builds.length ?
            <Table>
              <TableBody builds={builds} selectedBuilds={selectedBuilds} toggleSelection={toggleSelection} />
            </Table>
          :
            <p className="mt-12 text-center text-gray-500">No builds.</p>
          }

          <div className="flex justify-end mt-12">
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
    </Dialog>
  )
}
