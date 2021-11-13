const { ipcRenderer } = require("electron");
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/outline";

import Add from "./Add";

ipcRenderer.on("newPlan", (_) => {
  ipcRenderer.send("plans");
})


const HeaderItem = (props) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {props.title}
    </th>
  );
}

const Header = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <HeaderItem title="Name" />
      </tr>
    </thead>
  );
}

const Row = (props) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <NavLink to={`build/${props.id}`} className="block">
          {props.name}
        </NavLink>
      </td>
    </tr>
  );
}

export default () => {
  let [isAddOpen, setIsAddOpen] = useState(false);
  let [plans, setPlans] = useState([]);

  useEffect(() => {
    ipcRenderer.send("plans");

    ipcRenderer.on("plans", (_, plans) => {
      setPlans(plans);
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
              <PlusCircleIcon className="block h-6 w-6 text-teal text-gray-600" aria-hidden="true" />
            </button>
            Builds
          </div>

          <div className="flex flex-col mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <Header />
                    <tbody className="bg-white divide-y divide-gray-200">
                      {plans.map(plan => (
                        <Row key={plan.id} {...plan} />
                      ))}
                    </tbody>
                  </table >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      { <Add open={isAddOpen} close={closeAdd} /> }
    </main>
  );
}
