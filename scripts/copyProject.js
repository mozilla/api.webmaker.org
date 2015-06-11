/* jshint esnext: true */

// copyProject
// Moves a project from one database to another, assigning the "remixed" project
// the given user id
//
// execute from the scripts folder
// node ./copyProject <FROM_DB_CONN_STRING> <TO_DB_CONN_STRING> <ORIGINAL_PROJECT_ID> <NEW_USER_ID>
//
// The user *MUST* exist on the destination database, because transactions

try {
  var pg = require('pg').native;
} catch (ex) {
  console.warn('Native pg bindings failed to load or are not installed:', ex);
  pg = require('pg');
}

const Hoek = require('hoek');
const format = require('util').format;
const queries = require('../services/api/lib/queries');

const FROM_DB = process.argv[2];
const TO_DB = process.argv[3];

const FROM_PROJECT = process.argv[4];
const TO_USER = process.argv[5];

Hoek.assert(FROM_DB, 'You must provide a connection string to the source database');
Hoek.assert(TO_DB, 'You must provide a connection string to the destination database');
Hoek.assert(FROM_PROJECT, 'You must provide a source project id');
Hoek.assert(TO_USER, 'You must provide a user id for the migrated project');

function getTransactionClient() {
  return new Promise(function(resolve, reject) {
    pg.connect(TO_DB, function(err, client, release) {
      if ( err ) {
        console.error(err);
        return reject(err);
      }

      resolve({
        client: client,
        release: release
      });
    });
  });
}

function begin(transaction) {
  return new Promise(function(resolve, reject) {
    transaction.client.query('BEGIN', function(err, result) {
      if ( err ) {
        console.error('Failed to begin transaction', err);
        return reject(err);
      }

      resolve(result);
    });
  });
}

function executeTransaction(transaction, text, values) {
  return new Promise(function(resolve, reject) {
    console.info(
      format('Executing Transaction Query: %s - params: %s', text, values.join(', '))
    );
    transaction.client.query({
      text: text,
      values: values
    }, function(err, result) {
      if ( err ) {
        console.error('Query Execution Failed', err);
        return reject(err);
      }

      resolve(result);
    });
  });
}

function commit(transaction) {
  return new Promise(function(resolve, reject) {
    transaction.client.query('COMMIT', function(err, result) {
      if ( err ) {
        console.error('Failed to commit transaction', err);
        return reject(err);
      }

      console.info('Transaction committed to db');
      transaction.release();
      resolve(result);
    });
  });
}


function rollback(transaction) {
  return new Promise(function(resolve, reject) {
    transaction.client.query('ROLLBACK', function(err, result) {
      transaction.release();
      if ( err ) {
        console.error('Transaction rollback failed', err);
        return reject(err);
      }

      console.info('Transaction rolled back');
      resolve(result);
    });
  });
}

function formatRemixPage(rows) {
  var elements = [];

  rows.forEach(function(row) {
    if ( !row.elem_id ) {
      return;
    }
    elements.push({
      id: row.elem_id,
      type: row.elem_type,
      attributes: row.elem_attributes,
      styles: row.elem_styles
    });
  });

  return {
    id: rows[0].page_id,
    x: rows[0].page_x,
    y: rows[0].page_y,
    styles: rows[0].page_styles,
    elements: elements
  };
}

function formatRemixData(rows) {
  var pages = {};

  rows.forEach(function(row) {
    var pageId = row.page_id;
    if ( !pages[pageId] ) {
      pages[pageId] = [];
    }
    pages[pageId].push(row);
  });

  pages = Object.keys(pages).map(function(key) {
    return formatRemixPage(pages[key]);
  });

  return {
    id: rows[0].project_id,
    title: rows[0].project_title,
    thumbnail: rows[0].project_thumbnail,
    pages: pages
  };
}

function findProject() {
  return new Promise(function(resolve, reject) {
    console.info('Fetching project data');
    pg.connect(FROM_DB, function(err, client, release) {
      if ( err ) {
        return reject(err);
      }

      client.query({
        text: queries.projects.findDataForRemix,
        values: [
          FROM_PROJECT
        ]
      }, function(err, result) {
        release();
        if ( err ) {
          return reject(err);
        }

        if ( !result.rows.length ) {
          return reject(new Error('No Project Found'));
        }

        resolve(formatRemixData(result.rows));
      });
    });
  });
}

var projectToRemix,
    newProject,
    transaction,
    transactionErr;

findProject()
.then(function(formattedProject) {
  projectToRemix = formattedProject;
  return getTransactionClient();
})
.then(function(t) {
  transaction = t;
  return begin(transaction);
})
.then(function() {
  return executeTransaction(transaction, queries.projects.create,
    [
      TO_USER,
      null,
      '1.0.0',
      projectToRemix.title,
      projectToRemix.thumbnail
    ]
  );
}).then(function(result) {
  newProject = result.rows[0];

  return Promise.resolve(projectToRemix.pages.map(function(page) {
    return new Promise(function(resolve, reject) {
      var remixPage;
      executeTransaction(transaction, queries.pages.create,
        [
          newProject.id,
          page.x,
          page.y,
          page.styles
        ]
      ).then(function(result) {
        remixPage = result.rows[0];
        return Promise.resolve(page.elements.map(function(element) {
          return executeTransaction(transaction, queries.elements.create,
            [
              remixPage.id,
              element.type,
              element.attributes,
              element.styles
            ]
          );
        }));
      }).then(function(elementPromises) {
        return Promise.all(elementPromises);
      }).then(resolve)
      .catch(reject);
    });
  }));
}).then(function(pagePromises) {
  return Promise.all(pagePromises);
}).then(function() {
  return commit(transaction);
}).then(function() {
  console.log( 'SUCCESS' );
  console.log( '%j', newProject );
}).catch(function(err) {
  transactionErr = err;
  return rollback(transaction).then(function() {
    console.error('ERROR', transactionErr);
  });
}).catch(function(err) {
  console.error('ERROR', err);
});
