import React, { useEffect, useState } from "react";

import { HeaderItem, Table, TD } from "../Common/Table";

const TableHeader = () => {
  return (
    <tr>
      <HeaderItem>Image</HeaderItem>
      <HeaderItem>Name</HeaderItem>
      <HeaderItem>Color</HeaderItem>
      <HeaderItem>Quantity</HeaderItem>
    </tr>
  );
}

const TableRow = (props) => {
  const item = props.item;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img src=""></img>
          </div>
        </div>
      </td>
      <TD>
        {item.design.name}
      </TD>
      <TD></TD>
      <TD>
      </TD>
    </tr>
  );
}

const Items = (props) => {
  // FIXME: We're not even getting the right data structure here, I think.
  // Should be easier when that is done, although how to group items from multiple plans is
  // an interesting UX problem.
  console.log("plan items!!");
  console.log(props.items);

  return (
    <>
      {props.items.map((item, index) => (
        <TableRow key={index} item={item} />
      ))}
    </>
  );
}

export default (props) => (
  <div>
    <p>Parts</p>
    <Table header={<TableHeader />} >
      <Items items={props.items} />
    </Table>
  </div>
);
