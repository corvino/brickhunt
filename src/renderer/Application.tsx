import React, { Component } from "react";
import PartsTable from "./PartsTable";

class Application extends Component {
  render() {
    return (
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <PartsTable />
        </div>
      </div>
    );
  }
}

export default Application;
