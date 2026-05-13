FROM nginx
#COPY dist/ /usr/share/nginx/html/ 使用主机目录直接挂载
COPY default.conf /etc/nginx/conf.d/default.conf
