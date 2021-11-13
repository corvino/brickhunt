import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from "react-router-dom";

import { Disclosure, Menu, Transition } from '@headlessui/react'

import Build from "./Build";
import BuildsList from "./BuildsList";
import PartsTable from "./PartsTable";

const navigation = [
  { name: 'Parts', href: '/parts' },
  { name: 'Builds', href: '/builds' }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

class Application extends Component {
  render() {
    return (
      <div className="min-h-screen bg-white">
        <Disclosure as="nav" className="bg-white border-b border-gray-200">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => {
                        const current = window.location.pathname === item.href;
                        return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                          )}
                          aria-current={current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      )})}
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => {
                    const current = window.location.pathname === item.href;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          current
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                          'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                        )}
                        aria-current={current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    )
                  })}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="pb-10">

          <div className="bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

              <Router>
                <Switch>
                  <Route path="/parts" component={PartsTable} />
                  <Route path="/builds" component={BuildsList} />
                  <Route path="/build/:id" component={Build} />
                  <Route exact path="/"><Redirect to="/parts" /></Route>
                </Switch>
              </Router>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Application;
