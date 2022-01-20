import React from "react";

export const TD = (props) => {
  const className = `px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${props.className}`
  return (
    <td className={className}>
      {props.children}
    </td>
  );
}

export const HeaderItem = (props) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {props.children}
    </th>
  );
}

export const Table = (props) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {props.header}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {props.children}
              </tbody>
            </table >

          </div>
        </div>
      </div>
    </div>
  );
}
