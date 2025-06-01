FROM python:3.9-slim-bullseye

RUN apt-get update && apt-get install -y ca-certificates curl
RUN curl -o /etc/apt/trusted.gpg.d/angie-signing.gpg https://angie.software/keys/angie-signing.gpg
RUN echo "deb https://download.angie.software/angie/$(. /etc/os-release && echo "$ID/$VERSION_ID $VERSION_CODENAME") main" | tee /etc/apt/sources.list.d/angie.list > /dev/null
RUN apt-get update \
    && apt-get install -y libperl-dev libgd-dev \
                          libgeoip-dev libxslt-dev \
                          libxml2 build-essential \
                          libpcre3 libpcre3-dev \
                          zlib1g zlib1g-dev \
                          libssl-dev libfuzzy-dev \
                          libyajl-dev \
                          ufw cargo cmake \
                          lua5.3 liblua5.3-dev luarocks \
                          perl-modules iptables dumb-init ufw \
                          angie angie-module-modsecurity angie-module-lua \
                          angie-module-redis2 angie-module-rtmp angie-module-subs \
                          angie-module-testcookie angie-module-brotli angie-module-unbrotli\
                          angie-module-upload angie-module-keyval angie-module-echo \
                          angie-module-geoip2 angie-module-headers-more angie-module-eval \
                          angie-module-enhanced-memcached angie-module-dynamic-limit-req \
                          angie-module-cgi angie-module-ndk angie-module-postgres \
                          angie-module-vod angie-module-zip angie-module-vts angie-module-set-misc

WORKDIR /app

RUN mkdir -p /app/logs /etc/angie/ssl /etc/angie/html

COPY modsecurity .
RUN cp -R coreruleset-3.3.5 /etc/angie/modsecurity/
RUN cp modsec-config.conf /etc/angie/modsecurity/modsec-config.conf
RUN cp modsecurity.conf /etc/angie/modsecurity/modsecurity.conf

COPY ssl .
RUN cp *.crt /etc/angie/ssl/
RUN cp *.key /etc/angie/ssl/

COPY conf .
RUN cp angie.conf /etc/angie/angie.conf

RUN chown -R angie:angie /etc/angie

RUN touch logs/access.log
RUN touch logs/error.log

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["sh", "-c", "/usr/sbin/angie -t && /usr/sbin/angie -g 'daemon off;' && while true; do echo 'Angie work...' && sleep 300; done"]
