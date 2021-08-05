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
        <PartsTableHeaderItem title="Design ID"/>
        <PartsTableHeaderItem title="Name"/>
        <PartsTableHeaderItem title="Price"/>
      </tr>
    </thead>
  );
}

function dedupeElements(parts) {
  const uniqueParts = [];
  const elements = new Set();

  parts.forEach(part => {
    if (!elements.has(part.elementId)) {
      uniqueParts.push(part);
      elements.add(part.elementId);
    }
  });

  return uniqueParts;
}

function filterParts(parts, term: string) {
  if (0 === term.length) { return parts; }

  const filteredParts = [];
  const lowercaseTerm = term.toLowerCase();

  parts.forEach((part) => {
    if (part.name.toLowerCase().includes(lowercaseTerm) || String(part.designId).includes(lowercaseTerm)) {
      filteredParts.push(part);
    }
  });

  return filteredParts;
}

class PartsTable extends Component {
  parts: Array<any>;
  term:string;

  constructor(props) {
    super(props);
    this.state = {
      parts: []
    };
    this.term = "";
    this.searchChanged = this.searchChanged.bind(this);
  }

  async componentDidMount() {
    const partsData = await fs.promises.readFile("./lego-data/output-1418-1.ndjson");
    this.parts = dedupeElements(ndjson(partsData.toString()));

    this.setState({ parts: this.parts });
  }

  searchChanged(event) {
    this.term = event.target.value;

    this.setState({ parts: filterParts(this.parts, this.term) });
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Search</label>
          <div className="mt-1 h-10 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src="images/Brick1x1.svg" className="h-5 w-5" />
              </div>
              <input type="text" name="email" id="email" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" placeholder="Brick 2x4" value={this.term} onChange={this.searchChanged}/>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <PartsTableHeader />
                  <tbody className="bg-white divide-y divide-gray-200">
                    {this.state["parts"].map(part => (
                      <PartsTableRow key={part.elementId} {...part} />
                    ))}
                  </tbody>
                </table >
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PartsTable;
