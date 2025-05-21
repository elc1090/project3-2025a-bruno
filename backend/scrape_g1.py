# scrape_g1_limite.py

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from app import app, db, Link

FIXED_USER_EMAIL = 'user2@example.com'
MAX_NEW_NOTICIAS = 20  # limite de notícias a inserir por execução

def scrape_and_insert():
    base_url = 'https://g1.globo.com/'
    next_page_url = base_url
    inseridos = 0

    with app.app_context():
        while next_page_url and inseridos < MAX_NEW_NOTICIAS:
            resp = requests.get(next_page_url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')

            # 1) Extrai todos os <a class="feed-post-link"> desta página
            news_links = soup.find_all('a', class_='feed-post-link')

            for a in news_links:
                if inseridos >= MAX_NEW_NOTICIAS:
                    break  # já atingimos o limite; sai do for

                url = a.get('href')
                titulo = a.get_text(strip=True)

                # Pula se não tiver href válido
                if not url:
                    continue

                # Pula se já existe para o mesmo usuário
                existe = Link.query.filter_by(url=url, user_email=FIXED_USER_EMAIL).first()
                if existe:
                    continue

                new_link = Link(
                    url=url,
                    titulo=titulo,
                    user_email=FIXED_USER_EMAIL
                )
                db.session.add(new_link)
                inseridos += 1

            # Se já inserimos 20, sai do loop de paginação
            if inseridos >= MAX_NEW_NOTICIAS:
                break

            # 2) Tenta encontrar link “Carregar mais” / “Veja mais”
            btn = soup.find('a', string=lambda txt: txt and 'Carregar mais' in txt)
            if not btn:
                btn = soup.find('a', string=lambda txt: txt and 'Veja mais' in txt)

            if btn and btn.get('href'):
                next_page_url = urljoin(base_url, btn['href'])
            else:
                next_page_url = None  # não encontrou próximo; encerra

        # Commita tudo de uma vez (ou nada, se não inseriu)
        if inseridos > 0:
            db.session.commit()
            print(f'[+] Inseridas {inseridos} notícias para {FIXED_USER_EMAIL}')
        else:
            print('[i] Nenhuma notícia nova encontrada para inserir.')

if __name__ == '__main__':
    scrape_and_insert()
