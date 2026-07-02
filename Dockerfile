FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

RUN chmod -R a+rX /usr/share/nginx/html /etc/nginx/conf.d/default.conf
