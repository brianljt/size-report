async function GetLatestCommit() {
    let response = await fetch('/latestcommit');
    let result = await response.text();
    console.log('GetLatestCommit: ' + result);
    var l = 0;
    var r = result.length;
    while (result[l] == "\"") l = l+1;
    while (result[r-1] == "\n" || result[r-1]=="\"") r = r-1;
    result = result.substr(l, r-l);
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

async function Refresh(commit_id = "") {
    if (commit_id == "") commit_id = await GetLatestCommit();
    let data = await GetCommitInfo(commit_id);
    return data;
}

async function RefreshN(commit_id = "", num = 10) {
    if (commit_id == "") commit_id = await GetLatestCommit();
    let data = await GetNCommitsInfo(commit_id, num);
    return data;
}

// Return 一个list，长度为2，两个元素都是list
// 第一个list元素是commit-id列表
// 第二个list是每一次commit的详细数据
//      每一次commit详细数据构成：一个map，文件名和对应的数据使用情况
async function GetDataList(commit_id = "", num = 10) {
    let data = await RefreshN(commit_id, num);
    var result = [];
    var len = data.length;
    var commit_id_ = [];
    var file_use_ = [];
    // var file_name_ = [];
    // var text_ = [];
    // var bss_ = [];
    // var data_ = [];
    // var total_ = [];
    for (var i = 0; i < len; i++) {
        commit_id_.push(data[i].commit_id);
        file_use_.push(data[i].code);
        // var file_len = data[i].code.length;
        // var file_to_mem = {};
        // for (var j = 0; j<file_len; j++) {
        //     // if (file_name_.includes(data))
        //     var mem = {};
        //     mem["text"] = data[i].code[j].text;
        //     mem["data"] = data[i].code[j].data;
        //     mem["bss"] = data[i].code[j].bss;
        //     mem["total"] = data[i].code[j].total;
        //     file_to_mem[data[i].code[j].]
        // }
        // if (file_name_.includes(data.code))
    }
    result.push(commit_id_);
    result.push(file_use_);
    return result;
}

// 返回一个Map，5个key，分别是commit_id、text、bss、data、total
// 每个key对应一个list，每个元素是一个值。
async function GetDataListBySummary(commit_id = "", num = 10) {
    let data = await RefreshN(commit_id, num);
    var result = {};
    var len = data.length;
    var commit_id_ = [];
    var text_ = [];
    var bss_ = [];
    var data_ = [];
    var total_ = []
    for (var i = 0; i < len; i++) {
        commit_id_.push(data[i].commit_id);
        var text_summary = 0;
        var bss_summary = 0;
        var data_summary = 0;
        var total_summary = 0;
        for (var tmp in data[i].code) {
            text_summary = text_summary + data[i].code[tmp].text;
            bss_summary = bss_summary + data[i].code[tmp].bss;
            data_summary = data_summary + data[i].code[tmp].data;
            total_summary = total_summary + data[i].code[tmp].total;
        }
        text_.push(text_summary);
        bss_.push(bss_summary);
        data_.push(data_summary);
        total_.push(total_summary);
    }
    result["commit_id"] = commit_id_;
    result["text"] = text_;
    result["bss"] = bss_;
    result["data"] = data_;
    result["total"] = total_;
    return result;
}

// 用list套list的方式返回值，顺序需要注意，可以自行或叫zjw修改
async function GetDataListBySummaryList(commit_id = "", num = 10) {
    let data = await GetDataListBySummary(commit_id, num);
    var result = [];
    result.push(data["commit_id"]);
    result.push(data["text"]);
    result.push(data["data"]);
    result.push(data["bss"]);
    result.push(data["total"]);
    return result;
}