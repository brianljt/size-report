# -*- coding: utf-8 -*-
# @Time    : 2019/6/28 20:53
# @Author  : dailinqing
# @Email   : dailinqing@126.com
# @File    : chart_test.py
# @Software: PyCharm


from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def my_chart():
    return render_template('chart.html')

if __name__ == "__main__":
    # 运行项目
    app.run(debug=True)