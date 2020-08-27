import {
    Refresh,
    RefreshN,
} from './utils/requests.js';

// Return 一个list，长度为2，两个元素都是list
// 第一个list元素是commit-id列表
// 第二个list是每一次commit的详细数据
//      每一次commit详细数据构成：一个map，文件名和对应的数据使用情况
export async function GetDataList(commit_id = "", num = 10) {
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
export async function GetDataListBySummary(commit_id = "", num = 10) {
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
        data_.push(total_summary);
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
export async function GetDataListBySummaryList(commit_id = "", num = 10) {
    let data = await GetDataListBySummary(commit_id, num);
    var result = [];
    result.push(data["commit_id"]);
    result.push(data["text"]);
    result.push(data["data"]);
    result.push(data["bss"]);
    result.push(data["total"]);
    return result;
}