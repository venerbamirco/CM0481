# docker build
docker build . -t service-compiler --build-arg LOCALHOST=host.docker.internal|172.17.0.1

# docker run privileged
docker run -d -p 3000:3000 --privileged service-compiler

# bwrap starting command
bwrap \
 --ro-bind / / \
 --dev /dev \
 --tmpfs /tmp \
 --tmpfs /app \
 --dir /app/build-$BUILD \
 --chdir /app/build-$BUILD \
 --proc /proc \
 --unshare-all \
 --die-with-parent \
 "$@"