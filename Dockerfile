FROM nginx:1.27-alpine

COPY --chmod=644 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=644 index.html /usr/share/nginx/html/
COPY --chmod=644 app.js /usr/share/nginx/html/
COPY --chmod=644 styles.css /usr/share/nginx/html/
COPY --chmod=755 assets /usr/share/nginx/html/assets

RUN chmod -R a+rX /usr/share/nginx/html /etc/nginx/conf.d/default.conf
