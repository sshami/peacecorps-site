'use strict';

var setup = require('./setup');
setup = setup; // HACK not using module yet.

var $ = require('jquery');
var sinon = require('sinon');
var test = require('tapes');

var UpdatePercent = require('../update_donatepercent.js');

test('exists', function(t) {
  t.ok(UpdatePercent, 'It exists');
  t.end();
});

test('init', function(t) {
  t.test('should set code attribute', function(t) {
    var testUpdatePercent,
        $testEl;

    $testEl = $('<div></div>');
    $testEl.data('project-code', 'something');
    testUpdatePercent = new UpdatePercent($testEl);

    t.ok(testUpdatePercent.code, 'Sets the code attribute to something');

    t.end();
  });
  t.test('it should call getTotal()', function(t) {
    var testUpdatePercent,
        stub;

    stub = sinon.stub(UpdatePercent.prototype, 'getTotal');
    stub.returns(100);
    testUpdatePercent = new UpdatePercent($('<div></div>'));

    t.ok(stub.calledOnce, 'getTotal() was called once');

    UpdatePercent.prototype.getTotal.restore();
    t.end();
  });
  t.test('it should call setInterval', function(t) {
    var testUpdatePercent,
        stub;

    stub = sinon.stub(window, 'setInterval');
    stub.returns(1);
    testUpdatePercent = new UpdatePercent($('<div></div>'));

    t.ok(stub.calledOnce, 'setInterval() was called once');

    window.setInterval.restore();
    t.end();
  });
  t.end();
});

test('getTotal', function(t) {
  t.test('should call the ajax method with correct parameters', function(t) {
    var testUpdatePercent,
        expected,
        expectedCode = 'moo',
        stub;

    sinon.stub(UpdatePercent.prototype, 'init');
    stub = sinon.stub($, 'ajax');
    stub.returns({done: function() {}});
    testUpdatePercent = new UpdatePercent($('<div></div>'));
    testUpdatePercent.code = expectedCode;

    testUpdatePercent.getTotal();

    expected = {
      url: '/api/account/' + expectedCode,
      method: 'GET'
    };

    t.ok(stub.calledWith(expected), 'ajax was called with url set to ' +
      '/api/account/code and method set to GET');

    UpdatePercent.prototype.init.restore();
    $.ajax.restore();
    t.end();
  });
  t.end();
});

test('updateHTML', function(t) {
  t.test('will update the amount funded bar', function(t) {
    var testUpdatePercent,
        testData = {},
        expected = 50,
        actual,
        $testEl;

    sinon.stub(UpdatePercent.prototype, 'init');
    testData = {percent: expected};
    $testEl = $('<div><div class="funded-amount-bar"></div></div>');
    testUpdatePercent = new UpdatePercent($testEl);
    testUpdatePercent.updateHTML(testData);

    actual = $testEl.find('.funded-amount-bar').css('maxWidth');

    t.equals(actual, expected + '%', 'The maxWidth is set to expected');

    UpdatePercent.prototype.init.restore();
    t.end();
  });
  t.end();
});

test('getCode', function(t) {
  t.test('should get the data element "project-code" from root', function(t) {
    var testUpdatePercent,
        expected,
        actual,
        $testEl;

    sinon.stub(UpdatePercent.prototype, 'init');
    expected = 'testtest1';
    $testEl = $('<div></div>');
    $testEl.data('project-code', expected);
    testUpdatePercent = new UpdatePercent($testEl);
    actual = testUpdatePercent.getCode();

    t.equals(actual, expected, 'The data element equals ' +
      'testtest1');

    UpdatePercent.prototype.init.restore();
    t.end();
  });
  t.end();
});
