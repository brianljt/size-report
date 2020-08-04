from flask import request
from flask import jsonify
from flask import current_app
from backend.db import *

app = current_app

@app.route("/getcommit", methods=("GET","POST",))
def retrieve_commit_data():
    db = get_db()

    if request.method == "POST":
        content_type = request.headers["Content-type"]
        charset = request.headers["charset"]

        if content_type != "application/json":
            return
        
        commit = request.get_json()["commits"][0]
        parent_commit = request.get_json()["commits"][1]
        db.execute("insert into commitinfo value({},{},{})".format(commit["commit_id"], commit["timestamp"], parent_commit["parent_commit_id"]))

        for item in commit["code_size"]:
            db.execute("insert into filechange value({}, {},{},{},{},{})",
                        commit["commit_id"], 
                        item.key(), 
                        int(item.value()["text"]), 
                        int(item.value()["data"]),
                        int(item.value()["bss"]),
                        int(item.value()["total"]))

        # 若此条commit的上一条commit不在数据库中，插入这一条commit的记录。
        if db.execute("select * from commitinfo where id = ?", (parent_commit["parent_commit_id"],), ).fetchall() is None:
            db.execute("insert into commit info value({},{})".format(parent_commit["parent_commit_id"], parent_commit["parent_timestamp"]))

            for item in parent_commit["parent_code_size"]:
                db.execute("insert into filechange value({}, {},{},{},{},{})",
                        parent_commit["parent_commit_id"], 
                        item.key(), 
                        int(item.value()["text"]), 
                        int(item.value()["data"]),
                        int(item.value()["bss"]),
                        int(item.value()["total"]))


# 假定一秒内只有一条commit。可能后续需要修改
@app.route("/latestcommit", methods=("GET"))
def latest_commit_id():
    db = get_db()

    return db.execute("select id from commitinfo"
                      "order by timestamp desc").fetchone()["id"]



# 找到指定id对应的commit信息。不清楚前端请求的格式，需要修改。
# 这个函数需要提供commit_id信息，可能需要添加代码解析前端的post。
@app.route("/commitinfo", methods=("GET", "POST"))
def get_parent_commit_info():
    db = get_db()

    basic_info = db.execute("select * from "
                            "commitinfo where id = ?",
                            (commit_id,),).fetchone()

    fileinfo = db.execute("select * from "
                          "filechange where commit_id = ?",
                          (commit_id,),).fetchall()
    
    files = dict()

    for item in fileinfo:
        files[item["file_name"]] = {"text": item["textsize"], 
                                    "data": item["datasize"], 
                                    "bss": item["bsssize"], 
                                    "total": item["totalsize"]}

    return jsonify(
        commit_id=basic_info["commit_id"],
        parent_id=basic_info["parent_id"],
        created_time=basic_info["created_at"],
        code=files
    )

