import isEmpty from 'lodash.isempty';
import memoize from 'fast-memoize';

import {search, datasources} from 'pathway-commons';
import {queryProcessing} from './pcQueryProcessing.js';

export let queryFetch = memoize((queryObject, failureCount) => {
  failureCount = typeof failureCount === "number" ? failureCount : 0;
  return queryProcessing(queryObject, failureCount) // Get processed q using queryProcessing
    .then(processedQuery => { // Peform fetch using pathway-commons
      if(processedQuery == null) { // Check for queryProcessing failure
        // Force failure and signal break recursion
        failureCount = -1;
        throw new Error();
      }
      return Promise.all([
        search()
          .query(queryObject)
          .q(processedQuery)
          .format("json")
          .fetch(),
        datasources.fetch()
      ]);
    })
    .then(promiseArray => { // Perform filtering and throw error if no valid results returned
      var searchObject = promiseArray[0];
      var datasources = promiseArray[1];
      if(searchObject == null || (typeof searchObject === "object" && searchObject.empty === true)) { // Check for no returned results
        throw new Error();
      }

      searchObject.searchHit = searchObject.searchHit.filter(item => { // Perform filtering by numParticipants
          if(((queryObject.lt > item.numParticipants) || queryObject.lt === undefined) && ((queryObject.gt < item.numParticipants) || queryObject.gt === undefined)) {
            return true;
          }
          else {
            return false;
          }
        });

      if(searchObject.searchHit.length > 0) { // Process searchData to add extra properties from dataSources
        return {
          searchHit: searchObject.searchHit.map(searchResult => {
            searchResult["sourceInfo"] = datasources[searchResult.dataSource[0]];
            return searchResult;
          }),
          ...searchObject
        };
      }
      else { // Assume filtering has removed all search hits
        throw new Error();
      }
    })
    .catch(() => {
      if(isEmpty(queryObject)) { // Invalid object passed in
        return Promise.resolve(undefined);
      }
      if(failureCount !== -1) { // Advance failureCount and recurse
        return queryFetch(queryObject, failureCount + 1);
      }
      else { // Break recursion and return null
        return Promise.resolve(null);
      }
    });
});
