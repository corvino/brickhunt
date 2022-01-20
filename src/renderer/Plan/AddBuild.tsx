import React, { useEffect, useState } from "react";

import { HeaderItem, Table, TD } from "../Common/Table";

import { ipcRenderer } from "electron";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";

const TableHeader = () => {
  return (
    <tr>
      <HeaderItem>Name</HeaderItem>
      <HeaderItem></HeaderItem>
    </tr>
  );
}

const TableBody = (props) => {
  const items = props.builds;

  if (0 < items.length) {
    return (
      <>
        {items.map((item, index) => {
          const selected = props.selectedBuilds.includes(index);
          return (
            <tr
              className={selected ? "bg-gray-500" : ""}
              onClick={() => { props.toggleSelection(index) }}
              key={item.id}>
              <TD className={selected ? "text-white" : ""}>
                {item.name}
              </TD>
              <td>
                {selected &&
                  <CheckIcon className="w-5 h-5 text-white" />
                }
              </td>
            </tr>
          );
        })}
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
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
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
