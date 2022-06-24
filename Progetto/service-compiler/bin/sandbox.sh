#!/bin/sh

while getopts a:i:p:b:m:t:l: flag
do
    case "${flag}" in
        i) id=${OPTARG};;
        p) path=${OPTARG};;
        b) binary=${OPTARG};;
        m) memory=${OPTARG};;
        t) timeout=${OPTARG};;
        l) logsize=${OPTARG};;
        a) arguments=${OPTARG};;
    esac
done

input_bin=$path/$binary
build_path=/app/build-$id
build_bin=$build_path/$binary

ulimit -Sv $memory > /dev/null 2>&1

stdbuf -o0 -e0 timeout $timeout bwrap \
 --ro-bind / / \
 --dev /dev \
 --tmpfs /tmp \
 --tmpfs /app \
 --dir $build_path \
 --chdir $build_path \
 --bind $path $build_path \
 --chmod 755 $build_bin \
 --proc /proc \
 --unshare-all \
 --die-with-parent \
 $build_bin $arguments | head -c $logsize