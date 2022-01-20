const { ipcRenderer } = require("electron");
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import NewBuild from "./NewBuild";
import { HeaderItem, Table } from "../Common/Table";

ipcRenderer.on("buildCreated", (_) => {
  ipcRenderer.send("buildList");
});

const BuildRow = (props) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <NavLink to={`build/${props.id}`} className="block">
          {props.name}
        </NavLink>
      </td>
      <td className="w-5 pr-5">
        <TrashIcon className="block h-5 w-5 text-red-500" />
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

  const TableHeader = () => {
    return (
      <tr>
        <HeaderItem>
          Name
        </HeaderItem>
        <HeaderItem className="px-0 py-0">
          <button className="w-6 h-6 focus:outline-none" onClick={() => { setIsAddOpen(true) }}>
            <PlusCircleIcon className="block h-6 w-6" aria-hidden="true" />
          </button>
        </HeaderItem>
      </tr>
    );
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="relative w-full h-full">
          <Table header={<TableHeader />}>

            {builds.map(build => (
              <BuildRow key={build.id} {...build} />
            ))}
          </Table>
        </div>
      </div>

      <NewBuild open={isAddOpen} close={closeAdd} />
    </main>
  );
}
