from flask import Flask, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
# Configuração do Flask
app.config.update(
    SECRET_KEY='uma-chave-qualquer',
    SESSION_COOKIE_SAMESITE='Lax',    # permite envio em navegações top-level
    SESSION_COOKIE_HTTPONLY=True,       # segurança extra
)
# permite que o front acesse o back e envie cookies de sessão
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

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
    user_email     = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'titulo': self.titulo,
            'data_adicao': self.data_adicao.isoformat(),
            'confiabilidade': self.confiabilidade,
            'user_email': self.user_email
        }

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

@app.route('/login', methods=['GET'])
def login_placeholder():
    return '', 200


# CRUD de Links
@app.route('/links', methods=['GET'])
@login_required
def list_links():
    links = Link.query.order_by(Link.data_adicao.desc()).all()
    return jsonify([l.to_dict() for l in links])

@app.route('/links', methods=['POST'])
@login_required
def create_link():
    data = request.get_json(force=True)
    url = data.get('url')
    titulo = data.get('titulo')
    user_email=session['user_email']
    if not url or not titulo:
        return jsonify({'erro': 'URL e título são obrigatórios'}), 400

    novo = Link(url=url, titulo=titulo, user_email=user_email)
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
    db.session.commit()
    return jsonify({'msg': 'Link atualizado com sucesso'})

@app.route('/links/<int:id>', methods=['DELETE'])
@login_required
def delete_link(id):
    link = Link.query.get_or_404(id)
    db.session.delete(link)
    db.session.commit()
    return jsonify({'msg': 'Link removido com sucesso'})


@app.route('/my-links', methods=['GET'])
@login_required
def list_my_links():
    email = session['user_email']
    links = Link.query.filter_by(user_email=email).order_by(Link.data_adicao.desc()).all()
    return jsonify([l.to_dict() for l in links])

##############################################################################################################
# CRUD de Favoritos
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(128), nullable=False)
    link_id = db.Column(db.Integer, db.ForeignKey('links.id', ondelete='CASCADE'), nullable=False)

    link = db.relationship('Link', backref=db.backref('favorited_by', cascade='all, delete-orphan'))

    def to_dict(self):
        return self.link.to_dict()

@app.route('/favorites', methods=['GET'])
@login_required
def list_favorites():
    user = session['user_email']
    favs = Favorite.query.filter_by(user_email=user).all()
    
    return jsonify([f.to_dict() for f in favs]), 200

@app.route('/favorites/<int:link_id>', methods=['POST'])
@login_required
def add_favorite(link_id):
    user = session['user_email']
   
    link = Link.query.get(link_id)
    if not link:
        return jsonify({'erro': 'Link não encontrado'}), 404

    existe = Favorite.query.filter_by(user_email=user, link_id=link_id).first()
    if existe:
        return jsonify({'msg': 'Já é favorito'}), 200

    fav = Favorite(user_email=user, link_id=link_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({'msg': 'Adicionado aos favoritos'}), 201

@app.route('/favorites/<int:link_id>', methods=['DELETE'])
@login_required
def delete_favorite(link_id):
    user = session['user_email']
    fav = Favorite.query.filter_by(user_email=user, link_id=link_id).first()
    if not fav:
        return jsonify({'erro': 'Favorito não encontrado'}), 404

    db.session.delete(fav)
    db.session.commit()
    return jsonify({'msg': 'Removido dos favoritos'}), 200

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


