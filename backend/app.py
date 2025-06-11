from flask import Flask, jsonify, request, send_from_directory, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import secrets

app = Flask(__name__, static_folder='build')
CORS(app, supports_credentials=True)  # React에서의 API 요청을 허용, 세션 지원

# 세션 설정
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here-change-in-production')

# 관리자 키 (실제 운영환경에서는 환경변수로 설정)
ADMIN_KEY = os.environ.get('ADMIN_KEY', 'admin123')

# 로그인 실패 추적을 위한 딕셔너리 (실제 환경에서는 Redis나 DB 사용 권장)
login_attempts = {}
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_TIME = timedelta(minutes=15)  # 15분 잠금

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///guestbook.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 방명록 모델 정의
class GuestbookEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'message': self.message,
            'timestamp': self.timestamp.isoformat()
        }

# 포트폴리오 데이터 (정적 데이터)
portfolio_data = {
    "name": "임창훈",
    "bio": "인공지능 보안을 연구하고 있는 임창훈입니다.",    "projects": [
        {"title": "조선대학교 정보보호학과", "description": "2020.3 ~ NOW"},
        {"title": "조선대 ICT Convergence Security", "description": "2024.11 ~ NOW"}
    ],
    "papers": [
        {
            "title": "연합학습 환경에서의 Triggerless Clean-label 백도어 공격 연구",
            "titleEn": "Trigger-less Clean-label Backdoor Attack in Federated Learning",
            "authors": "임창훈*, 김승한**, 최민영**, 김현일***",
            "conference": "한국정보보호학회",
            "year": "2025",
            "status": "게재 예정"
        }
    ],
    "interests": [
        "인공지능 보안", "연합학습", "백도어 공격", "분산 ID"
    ]
}

# 관리자 인증 확인 함수
def is_admin():
    # 세션 만료 시간 체크 (2시간)
    if 'admin_login_time' in session:
        login_time = datetime.fromisoformat(session['admin_login_time'])
        if datetime.now() - login_time > timedelta(hours=2):
            session.pop('is_admin', None)
            session.pop('admin_login_time', None)
            return False
    
    return session.get('is_admin', False)

def is_ip_locked(ip):
    """IP가 잠겨있는지 확인"""
    if ip not in login_attempts:
        return False
    
    attempts = login_attempts[ip]
    if attempts['count'] >= MAX_LOGIN_ATTEMPTS:
        time_since_last = datetime.now() - attempts['last_attempt']
        if time_since_last < LOCKOUT_TIME:
            return True
        else:
            # 잠금 시간이 지났으므로 리셋
            del login_attempts[ip]
            return False
    return False

def record_failed_login(ip):
    """실패한 로그인 시도 기록"""
    if ip not in login_attempts:
        login_attempts[ip] = {'count': 0, 'last_attempt': datetime.now()}
    
    login_attempts[ip]['count'] += 1
    login_attempts[ip]['last_attempt'] = datetime.now()

def reset_login_attempts(ip):
    """성공한 로그인 후 시도 횟수 리셋"""
    if ip in login_attempts:
        del login_attempts[ip]

@app.route('/admin/login', methods=['POST'])
def admin_login():
    client_ip = request.remote_addr
    
    # IP 잠금 상태 확인
    if is_ip_locked(client_ip):
        remaining_time = LOCKOUT_TIME - (datetime.now() - login_attempts[client_ip]['last_attempt'])
        minutes = int(remaining_time.total_seconds() // 60)
        return jsonify({
            "error": f"Too many failed login attempts. Please try again in {minutes} minutes."
        }), 429
    
    data = request.json
    if not data or 'key' not in data:
        return jsonify({"error": "Admin key required"}), 400
    
    if data['key'] == ADMIN_KEY:
        session['is_admin'] = True
        session['admin_login_time'] = datetime.now().isoformat()
        reset_login_attempts(client_ip)
        return jsonify({"message": "Admin login successful"}), 200
    else:
        record_failed_login(client_ip)
        remaining_attempts = MAX_LOGIN_ATTEMPTS - login_attempts[client_ip]['count']
        
        if remaining_attempts > 0:
            return jsonify({
                "error": f"Invalid admin key. {remaining_attempts} attempts remaining."
            }), 401
        else:
            return jsonify({
                "error": "Too many failed attempts. IP locked for 15 minutes."
            }), 429

@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('is_admin', None)
    session.pop('admin_login_time', None)
    return jsonify({"message": "Admin logout successful"}), 200

@app.route('/admin/status', methods=['GET'])
def admin_status():
    admin_status = is_admin()
    response_data = {"is_admin": admin_status}
    
    if admin_status and 'admin_login_time' in session:
        login_time = datetime.fromisoformat(session['admin_login_time'])
        expires_at = login_time + timedelta(hours=2)
        response_data["expires_at"] = expires_at.isoformat()
        response_data["expires_in_minutes"] = int((expires_at - datetime.now()).total_seconds() // 60)
    
    return jsonify(response_data), 200

@app.route('/admin/guestbook', methods=['GET'])
def admin_get_all_guestbook():
    """관리자 전용: 모든 방명록 항목 조회 (페이징 없음)"""
    if not is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        entries = GuestbookEntry.query.order_by(GuestbookEntry.timestamp.desc()).all()
        return jsonify({
            "entries": [entry.to_dict() for entry in entries],
            "total": len(entries)
        })
    except Exception as e:
        return jsonify({"error": "Failed to retrieve entries"}), 500

@app.route('/admin/guestbook/stats', methods=['GET'])
def admin_guestbook_stats():
    """관리자 전용: 방명록 통계"""
    if not is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        total_entries = GuestbookEntry.query.count()
        today = datetime.now().date()
        today_entries = GuestbookEntry.query.filter(
            GuestbookEntry.timestamp >= datetime.combine(today, datetime.min.time())
        ).count()
        
        # 최근 7일간 통계
        week_ago = datetime.now() - timedelta(days=7)
        week_entries = GuestbookEntry.query.filter(
            GuestbookEntry.timestamp >= week_ago
        ).count()
        
        return jsonify({
            "total_entries": total_entries,
            "today_entries": today_entries,
            "week_entries": week_entries
        })
    except Exception as e:
        return jsonify({"error": "Failed to retrieve stats"}), 500

@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    return jsonify(portfolio_data)

@app.route('/guestbook', methods=['GET'])
def get_guestbook():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # 페이지당 최대 항목 수 제한
        per_page = min(per_page, 50)
        
        entries = GuestbookEntry.query.order_by(GuestbookEntry.timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            "entries": [entry.to_dict() for entry in entries.items],
            "pagination": {
                "page": entries.page,
                "pages": entries.pages,
                "per_page": entries.per_page,
                "total": entries.total,
                "has_next": entries.has_next,
                "has_prev": entries.has_prev
            }
        })
    except Exception as e:
        return jsonify({"error": "Failed to retrieve entries"}), 500

@app.route('/guestbook', methods=['POST'])
def add_guestbook_entry():
    entry_data = request.json  # { "name": "...", "message": "..." }
    if not entry_data or "name" not in entry_data or "message" not in entry_data:
        return jsonify({"error": "Invalid entry data"}), 400
    
    # 입력 데이터 검증
    name = entry_data["name"].strip()
    message = entry_data["message"].strip()
    
    if not name or not message:
        return jsonify({"error": "Name and message cannot be empty"}), 400
    
    if len(name) > 100:
        return jsonify({"error": "Name is too long (max 100 characters)"}), 400
    
    if len(message) > 1000:
        return jsonify({"error": "Message is too long (max 1000 characters)"}), 400
    
    new_entry = GuestbookEntry(
        name=name,
        message=message
    )
    
    try:
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"message": "Entry added", "entry": new_entry.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add entry"}), 500

@app.route('/guestbook/<int:entry_id>', methods=['DELETE'])
def delete_guestbook_entry(entry_id):
    # 관리자 권한 확인
    if not is_admin():
        return jsonify({"error": "Admin access required"}), 403
    
    entry = GuestbookEntry.query.get_or_404(entry_id)
    
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Entry deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete entry"}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    # 데이터베이스 테이블 생성
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host="0.0.0.0", port=8080)
