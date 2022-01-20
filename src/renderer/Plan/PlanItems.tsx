import React, { useEffect, useState } from "react";

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

export default (props) => (
  <div>
    <p>Parts</p>
    <Table items={props.items} />
  </div>
);
