// Copyright IBM Corp. 2016,2020. All Rights Reserved.
// Node module: loopback-connector-dashdb
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

module.exports = require('should');

const Connector = require('../');
const juggler = require('loopback-datasource-juggler');
let DataSource = juggler.DataSource;

let schemaName, db;

/** these are the env variables in jenkins **/
if (process.env.CI && process.env.PACKAGE_NAME &&
  (process.env.BUILD_NUMBER || process.env.BUILD_ID) &&
  (process.env.nodeVersion || process.env.node)) {
  const buildName = process.env.PACKAGE_NAME.split('-')[2].toUpperCase();
  const buildNumber = process.env.BUILD_NUMBER || process.env.BUILD_ID;
  const nodeVersion = process.env.nodeVersion || process.env.node;
  const os = process.env.OS || process.platform;
  schemaName = 'SCHEMA' + buildNumber + '_' + buildName +
    '_' + os.toUpperCase() + '_' + nodeVersion;
}

const config = {
  username: process.env.DASHDB_USERNAME,
  password: process.env.DASHDB_PASSWORD,
  hostname: process.env.DASHDB_HOSTNAME || 'localhost',
  port: process.env.DASHDB_PORTNUM || 60000,
  database: process.env.DASHDB_DATABASE || 'testdb',
  schema: schemaName || process.env.DASHDB_SCHEMA || 'STRONGLOOP',
};

global.config = config;

global.getDataSource = global.getSchema = function(options) {
  db = new DataSource(Connector, global.config);
  db.log = function(a) {
    console.log(a);
  };
  return db;
};

global.resetDataSourceClass = function(ctor) {
  DataSource = ctor || juggler.DataSource;
  const promise = db ? db.disconnect() : Promise.resolve();
  db = undefined;
  return promise;
};

global.connectorCapabilities = {
  ilike: false,
  nilike: false,
};

global.sinon = require('sinon');
