import { Octokit } from "octokit"; // to make GET requests from Github API
import dotenv from 'dotenv'
dotenv.config() // to use .env in file

let octokit = new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN });

async function getPullRequestInsights() {
    
    // Documentation: List Pull Requests: https://docs.github.com/en/rest/pulls/pulls#list-pull-requests
    const pullRequests = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: 'celo-org',
        repo: 'celo-monorepo',
        base: 'odisCip40', // branch name
        state: 'all', // open, closed, all
    });
    
    var numberPullRequestsOpened = 0;
    var numberLinesAdded = 0;
    var numberLinesDeleted = 0;
    var numberCommits = 0;

    // Counts opened pull requests between two dates
    for (let i = 0; i < pullRequests.data.length; i++) {
        // parse high-level PR data
        const pullRequest = pullRequests.data[i];
        const createdAt = new Date(pullRequest.created_at);
        const mergedAt = new Date(pullRequest.merged_at);


        
        if (createdAt >= new Date("2022-08-24") && createdAt <= new Date("2022-10-01")) {
            // get detailed PR data
            const prNumber = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
                owner: 'celo-org',
                repo: 'celo-monorepo',
                base: 'odisCip40', // branch name
                state: 'all', // open, closed, all
                pull_number: pullRequest.number
            });

            // increment counters
            numberPullRequestsOpened++;
            numberLinesAdded += prNumber.data.additions;
            numberLinesDeleted += prNumber.data.deletions;
            numberCommits += prNumber.data.commits;
        }
    };
    console.log(`numberPullRequestsOpened: ${numberPullRequestsOpened}`);
    console.log(`numberLinesAdded: ${numberLinesAdded}`);
    console.log(`numberLinesDeleted: ${numberLinesDeleted}`);
    console.log(`numberCommits: ${numberCommits}`);
}

// Defines the function to be called when the app is run
async function main() {
    await getPullRequestInsights();
}

// Runs the script
main();