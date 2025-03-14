from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='build')
CORS(app)  # React에서의 API 요청을 허용

# 포트폴리오 데이터 (정적 데이터)
portfolio_data = {
    "name": "임창훈",
    "bio": "인공지능 보안을 연구하고 있는 임창훈입니다.",
    "projects": [
        {"title": "조선대학교 정보보호학과", "description": "2020.3 ~ NOW"},
        {"title": "조선대 ICT Convergence Security", "description": "2024.11 ~ NOW"}
    ],
    "interests": [
        "인공지능 보안", "인공지능", "오픈소스", "분산 ID"
    ]
}

# 방명록 데이터 (메모리 저장, 서버 재시작 시 초기화됨)
guestbook_entries = []

@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(portfolio_data)

@app.route('/guestbook', methods=['GET'])
def get_guestbook():
    return jsonify({"entries": guestbook_entries})

@app.route('/guestbook', methods=['POST'])
def add_guestbook_entry():
    entry = request.json  # { "name": "...", "message": "..." }
    if not entry or "name" not in entry or "message" not in entry:
        return jsonify({"error": "Invalid entry data"}), 400
    guestbook_entries.append(entry)
    return jsonify({"message": "Entry added", "entry": entry}), 201

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
