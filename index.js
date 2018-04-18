var GitHubApi = require('@octokit/rest');
var dateFormat = require('dateformat');
var github = new GitHubApi({
    version: '3.0.0'
});

exports.handler = function(event, context) {
    const githubEvent = event.Records[0].Sns.Message;   
    console.log('Received GitHub event:', githubEvent);
    
    // Authenticate to comment on the issue
    github.authenticate({
        type: 'oauth',
        token: process.env.GITHUBTOKEN
    });

    const body = JSON.parse(githubEvent);
    
    const createIssue = {
        owner: body.repository.owner.login,
        repo: body.repository.name,
        title: "Lambda Hook! " + dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        body: "Hi @" + body.repository.owner.name + "!\n\n" +
              "Something triggered me to open another issue! Sorry!"
    };

    console.log('Creating issue:', JSON.stringify(createIssue));
    github.issues.create(createIssue, context.done);
};