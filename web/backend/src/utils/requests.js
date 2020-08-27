async function GetLatestCommit() {
    let response = await fetch('/latestcommit');
    let result = await response.text();
    console.log('GetLatestCommit: ' + result);
    return result;
}

async function GetCommitInfo(commit_id) {
    let data = {
        commit_id: commit_id
    };
    let response = await fetch('/commitinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();
    console.log('GetCommitInfo: ',result);
    return result;
}

async function GetNCommitsInfo(commit_id, num) {
    let data = {
        latest_commit_id: commit_id,
        n_commit_info: num
    };
    let response = await fetch('/ncommitinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();
    console.log('GetNCommitsInfo: ',result);
    return result;
}

export async function Refresh(commit_id = "") {
    if (commit_id == "") commit_id = await GetLatestCommit();
    let data = await GetCommitInfo(commit_id);
    return data;
}

export async function RefreshN(commit_id = "", num = 10) {
    if (commit_id == "") commit_id = await GetLatestCommit();
    let data = await GetNCommitsInfo(commit_id, num);
    return data;
}