/*!
 * Copyright 2002 - 2015 Webdetails, a Pentaho company. All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

define(['./BaseComponent', '../Logger'], function(BaseComponent, Logger) {

    var QueryComponent = BaseComponent.extend({
    visible: false,
    update : function() {
      QueryComponent.makeQuery(this);
    },
    warnOnce: function() {
      Logger.log("Warning: QueryComponent behaviour is due to change. See "
        + "http://http://www.webdetails.org/redmine/projects/cdf/wiki/QueryComponent"
        + " for more information");
      delete(this.warnOnce);
    }
  },
  {
    makeQuery: function(object){

      if(this.warnOnce) { this.warnOnce(); }

      var cd = object.queryDefinition;
      if(cd == undefined) {
        Logger.log("Fatal - No query definition passed","error");
        return;
      }
      var query = object.dashboard.getQuery(cd);
      object.queryState = query;

      // Force synchronous queries
      query.setAjaxOptions({async: false});

      query.fetchData(object.parameters, function(values) {
        // We need to make sure we're getting data from the right place,
        // depending on whether we're using CDA

        changedValues = undefined;
        object.metadata = values.metadata;
        object.result = values.resultset != undefined ? values.resultset : values;
        object.queryInfo = values.queryInfo;
        if((typeof(object.postFetch)=='function')) {
          changedValues = object.postFetch(values);
        }
        if(changedValues != undefined) {
          values = changedValues;

        }

        if(object.resultvar != undefined) {
          object.dashboard.setParameter(object.resultvar, object.result);
        }
        object.result = values.resultset != undefined ? values.resultset : values;
        if(typeof values.resultset != "undefined") {
          object.metadata = values.metadata;
          object.queryInfo = values.queryInfo;
        }
      });

    }
  });

  return QueryComponent;

});
