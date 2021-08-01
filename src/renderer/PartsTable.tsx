import React, { Component } from "react";
import fs from "fs";
import ndjson from "ndjson-parse";

const PartsTableRow = (props) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img src={`${props.imgURL}`}></img>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {props.designId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {props.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${props.price}
      </td>
    </tr>
  );
}

const PartsTableHeaderItem = (props) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {props.title}
    </th>
  );
}

const PartsTableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <PartsTableHeaderItem title="Image"/>
        <PartsTableHeaderItem title="Name"/>
      </tr>
    </thead>
  );
}

class PartsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parts: []
    };
  }

  async componentDidMount() {
    const partsData = await fs.promises.readFile("./lego-data/output-1418-1.ndjson");
    const parts = ndjson(partsData.toString());

    this.setState({ parts });

    console.log(parts);
  }

  render() {
    return (
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <PartsTableHeader />
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.state["parts"].map(part => (
                    <PartsTableRow key={part.designId} {...part} />
                  ))}
                </tbody>
              </table >
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PartsTable;
