import { ipcRenderer } from "electron";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import { HeaderItem, Table } from "../Common/Table";
import { PlusCircleIcon } from "@heroicons/react/outline";

import AddBuild from "./AddBuild"

export default (props) => {
  const {params: {id}} = props.match;

  let [isAddOpen, setIsAddOpen] = useState(false);

  let [plan, setPlan] = useState({builds: []} as any);
  let [items, setItems] = useState([])

  useEffect(() => {
    ipcRenderer.send("plan", id);

    ipcRenderer.on("plan", (_, plan) => {
      setPlan(plan);
    });
  }, []);

  const closeAdd = () => { setIsAddOpen(false) };

  const AddButton = () => {
    return (
      <button className="w-6 h-6 focus:outline-none align-middle float-right" onClick={() => { setIsAddOpen(true) }}>
        <PlusCircleIcon className="block h-6 w-6 text-teal text-gray-500" aria-hidden="true" />
      </button>
    );
  }

  const TableHeader = () => {
    return (
      <tr>
        <HeaderItem>Image</HeaderItem>
        <HeaderItem>Name</HeaderItem>
        <HeaderItem>title</HeaderItem>
        <HeaderItem>
          Quantity
          <AddButton />
        </HeaderItem>
      </tr>
    );
  }

  const TableBody = () => {
    if (0 < items.length) {
      return (
        <> it items.length
          {items.map(item => (
            <tr><td>hello</td></tr>
          ))}
        </>
      );
    } else {
      return <tr><td>hello</td></tr>
    }
  }

  return (
    <div>
      <header className="py-4">
        <NavLink to="/plans">
          <ArrowNarrowLeftIcon className="inline-block w-6 align-baseline mr-2" />
        </NavLink>
        <h1 className="inline-block text-xl font-bold leading-tight align-top text-gray-900">
          {plan.name}
        </h1>
      </header>

      <div>
        {0 < plan.builds.length ?
          <Table header={<TableHeader />}>
            <TableBody />
          </Table>
        :
          <p>No builds<AddButton /></p>
        }

      </div>

      <AddBuild plan={plan} open={isAddOpen} close={closeAdd} />
    </div>
  );
}
