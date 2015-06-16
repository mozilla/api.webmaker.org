var request = require('request');
var cli = require('cli');
var copyPaste = require("copy-paste");

var screenshotServerBaseURL = 'http://jbuck-wm-screenshot-production.herokuapp.com/mobile-center-cropped/small/webmaker-desktop/';

var userID = process.argv[2];
var projectID = process.argv[3];
var cliOptions = cli.parse();

if (!userID || !projectID) {
  console.log('Expected userID and projectID.');
  console.log('Usage: generate-thumbnail <userID> <projectID>');
  return;
}

request('https://api.webmaker.org/users/' + userID + '/projects/' + projectID + '/pages', function (err, resp, body) {
    if (err || resp.statusCode !== 200) {
      console.error('Couldn\'t get project.', JSON.parse(body));
      return;
    }

    var project = JSON.parse(body);
    var firstPage = project.pages.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    })[0];

    var base64ThumbnailURL = new Buffer('https://beta.webmaker.org/#/thumbnail?user=' + userID + '&project=' + projectID + '&page=' + firstPage.id).toString('base64');
    var thumbnailPostURL = screenshotServerBaseURL + base64ThumbnailURL;

    request.post(thumbnailPostURL, function (err, resp, body) {
      if (err || resp.statusCode !== 200) {
        console.error('Couldn\'t contact thumbnail server.', JSON.parse(body));
        return;
      }

      var parsedBody = JSON.parse(body);

      console.log(parsedBody.screenshot);

      if (cliOptions.c) {
        copyPaste.copy(parsedBody.screenshot)
      }
    });

});
