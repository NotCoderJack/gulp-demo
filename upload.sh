#!/bin/bash

# 本地git 库是否提交
lines = `git status --porcelain | wc -l` #统计输出信息行数
if [ "$lines" -gt 0]; then
    echo -e "\033[31m Git not clean, please commit first]"
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
  confirm = `read -p 'Note: before your upload, check the env file again! Sure to upload ? yes/no'`
  echo "$confirm"
  #git pull origin "$master"
  #git pull origin "$branch"
  #git push origin "$branch"
  #gulp test
  echo -e "\n\033[92m Upload to test ftp successfully.\n"

#上传发布ftp
elif [ "$1" == "-depoly" ]; then
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
  echo -e "\033[31m Please select upload mode."

fi