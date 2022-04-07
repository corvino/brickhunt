import { ipcRenderer } from "electron";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import { HeaderItem, Table, TD } from "../Common/Table";
import { PlusCircleIcon } from "@heroicons/react/outline";

import AddBuild from "./AddBuild";
import PlanItems from "./PlanItems";
import PlansList from "./PlansList";

const wranglePlan = (plan) => {
  if (null === plan) {
    return [];
  } else {

    // console.log(JSON.stringify(plan.builds[0], null, 4));
    console.log(plan.builds[0]);

    const itemMap = {};
    plan.builds.forEach(build => {
      build.items.forEach(part => {
        const design = part.partColor.part;
        const color = part.partColor.color;
        const key = design.id;


        if (Object.keys(itemMap).includes(part.id)) {
          itemMap[part.id].builds.push(build);
        } else {
          itemMap[part.id] = {
            design,
            planEntry: { color },
            builds: [build]
          }
        }
      });
    });
    return Object.entries(itemMap).map(item => item[1]) as any;
  }
}

export default (props) => {
  const {params: {id}} = props.match;

  let [isAddOpen, setIsAddOpen] = useState(false);

  let [plan, setPlan] = useState(null);

  const items = wranglePlan(plan);
  console.log(items);

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
        <HeaderItem>Name</HeaderItem>
        <HeaderItem>
          Quantity
          <AddButton />
        </HeaderItem>
      </tr>
    );
  }

  const TableBody = () => {
    return (
      <>
        {/* {items.map(item => (
          <tr key={item.part.id}> */}
        {plan.builds.map(build => (
          <tr key={build.id}>
            <TD>{build.name}</TD>
            <TD>{build.items.length}</TD>
          </tr>
        ))}
      </>
    );
  }

  if (null === plan) {
    return (
      <div>
        <header className="py-4 text-gray-600 text-xl">
          <NavLink to="/plans">
            <ArrowNarrowLeftIcon className="inline-block w-6 align-baseline mr-2" />
          </NavLink>
          <h1 className="inline-block text-xl font-bold leading-tight align-top">
            Loading ...
          </h1>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="py-4 text-gray-600 text-xl">
        <NavLink to="/plans">
          <ArrowNarrowLeftIcon className="inline-block w-6 align-baseline mr-2" />
        </NavLink>
        <h1 className="inline-block text-xl font-bold leading-tight align-top">
          {plan.name}
        </h1>
      </header>

      <div>
        <p className="test-gray-500">Builds</p>
        {0 < plan.builds.length ?
          <Table header={<TableHeader />}>
            <TableBody />
          </Table>
        :
          <p>No builds<AddButton /></p>
        }
      </div>

      <div className="mt-12">
        {null !== items || 0 < items.length ?
          //<p>{`${items.length}`} Items</p>
          <PlanItems items={items} />
        :
          <p>No Items</p>
        }
      </div>

      <AddBuild plan={plan} open={isAddOpen} close={closeAdd} />
    </div>
  );
}
