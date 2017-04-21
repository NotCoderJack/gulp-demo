#!/bin/bash

# 本地git 库是否提交
#统计输出信息行数
lines=`git status --porcelain | wc -l`
if [ "$lines" -gt 0 ]; then
    echo -e "\033[31m Git not clean, please commit first"
    exit
fi

master="master"

# 获取当前分支
branch=`git status --branch | sed -n 1p` # sed -n 1p 获取第一行输出
regex="([^[:space:]]+)$"
if [[ "$branch" =~ $regex ]]; then
    branch=${BASH_REMATCH[1]}
fi

#禁止操作主干
if [ "$branch" == "master" ]; then
  echo -e "\033[31m Please switch to your dev branch."
  exit
fi

# 上传测试FTP
if [ "$1" == "-test" ]; then
    echo 'Note: before your upload, check the env file again! Sure to upload your project for TEST? yes/no:'
    read confirm
    if [ "$confirm" == "yes" ]; then
        git pull origin "$master"
        git pull origin "$branch"
        git push origin "$branch"
        gulp lines
        echo -e "\n\033[92m Upload to test ftp successfully.\n"
    else
        echo "Cancel Test Successfully!"
        exit
    fi

#上传发布ftp
elif [ "$1" == "-depoly" ]; then
    echo 'Note: before your upload, check the env file again! Sure to upload your project for TEST? yes/no:'
    read confirm
    if [ "$confirm" == "yes" ]; then
        git pull origin "$master"
        git pull origin "$branch"
        git push origin "$branch"

        git checkout "$master"
        git merge "$branch"
        git push origin "$master"

        gulp deploy

        git add .
        git commit -m 'new release'
        git push origin master
        git checkout "$branch"
        git pull origin master
        git push origin "$branch"
        echo -e "\n\033[92m Upload to deploy ftp successfully.\n"
    else
        echo "Cancel Deploy Successfully !"
        exit
    fi


else
  echo -e "\033[31m Please select upload mode. -test or -deploy"

fi
