FROM nginx

MAINTAINER OSS-Lab

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir "/usr/share/nginx/log/"

ADD default.conf /etc/nginx/conf.d/

COPY out/ /usr/share/nginx/html/


### RUN WITH THE FOLLOWING COMMAND ###

#docker run -p 9081:80 \
#--restart=always \
#-v /root/log/:/usr/share/nginx/log/ \
#--name persona-book \
#-d persona-book

######################################
