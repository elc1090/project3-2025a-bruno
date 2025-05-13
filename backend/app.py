from flask import Flask, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
# permite que o front acesse o back e envie cookies de sessão
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.secret_key = 'uma-chave-qualquer'
# Configuração da conexão com MySQL 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Brunop10%40@localhost/project3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Link
class Link(db.Model):
    __tablename__ = 'links'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    data_adicao = db.Column(db.DateTime, server_default=db.func.now())
    confiabilidade = db.Column(db.Float, nullable=True)

# Dicionário em memória para usuários pré-cadastrados
USERS = {
    'bruno@example.com': '123',
    'user2@example.com': '123',
    'user3@example.com': '123'
}

# Decorator para proteger rotas
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_email' not in session:
            return jsonify({'erro': 'Autenticação necessária'}), 401
        return f(*args, **kwargs)
    return decorated

# Rota de login
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json(force=True)
    email = data.get('email')
    senha = data.get('senha')
    if not email or not senha or USERS.get(email) != senha:
        return jsonify({'erro': 'Credenciais inválidas'}), 401

    session['user_email'] = email
    return jsonify({'msg': 'Login realizado com sucesso'})

# CRUD de Links
@app.route('/links', methods=['GET'])
@login_required
def list_links():
    links = Link.query.all()
    return jsonify([{
        'id': l.id,
        'url': l.url,
        'titulo': l.titulo,
        'data_adicao': l.data_adicao.isoformat(),
        'confiabilidade': l.confiabilidade
    } for l in links])

@app.route('/links', methods=['POST'])
@login_required
def create_link():
    data = request.get_json(force=True)
    url = data.get('url')
    titulo = data.get('titulo')
    if not url or not titulo:
        return jsonify({'erro': 'URL e título são obrigatórios'}), 400

    novo = Link(url=url, titulo=titulo)
    db.session.add(novo)
    db.session.commit()
    return jsonify({'id': novo.id}), 201

@app.route('/links/<int:id>', methods=['PUT'])
@login_required
def update_link(id):
    link = Link.query.get_or_404(id)
    data = request.get_json(force=True)
    link.url = data.get('url', link.url)
    link.titulo = data.get('titulo', link.titulo)
    link.confiabilidade = data.get('confiabilidade', link.confiabilidade)
    db.session.commit()
    return jsonify({'msg': 'Link atualizado com sucesso'})

@app.route('/links/<int:id>', methods=['DELETE'])
@login_required
def delete_link(id):
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return jsonify({'msg': 'Link removido com sucesso'})

if __name__ == '__main__':
    app.run(debug=True)
