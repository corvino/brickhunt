import { ipcRenderer } from "electron";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";

export default (props) => {
  const {params: {id}} = props.match;

  let x: any = {items: []};
  let y: any;
  let [build, setBuild] = useState(x);
  let [items, setItems] = useState([]);

  useEffect(() => {
    console.log("send");
    ipcRenderer.send("build", id);

    ipcRenderer.on("build", (_, build) => {
      setBuild(build);
      setItems(build.items);
    });
  }, []);

  const HeaderItem = (props) => {
    return (
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {props.title}
      </th>
    );
  }

  const TableHeader = () => {
    return (
      <thead className="bg-gray-50">
        <tr>
          <HeaderItem title="Image" />
          <HeaderItem title="Name"/>
          <HeaderItem title="Color"/>
          <HeaderItem title="Quantity"/>
        </tr>
      </thead>
    );
  }

  const TableRow = (props) => {
    const item = props.item;
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img src={item.partColor.imgURL}></img>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.partColor.part.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.partColor.color.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {item.quantity}
        </td>
      </tr>
    );
  }

  const Table = (props) => {
    return (
      <table className="min-w-full divide-y divide-gray-200">
      <TableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {props.items.map(item => (
            <TableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table >
    );
  }

  return (
    <div>
      <header className="py-4 text-gray-600">
        <NavLink to="/builds">
          <ArrowNarrowLeftIcon className="inline-block w-6 align-baseline mr-2" />
        </NavLink>
        <h1 className="inline-block text-xl font-bold leading-tight align-top">
          {build.name}
        </h1>
      </header>
      <div>
        <Table items={items} />
      </div>
    </div>
  );
}
