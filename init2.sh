#!/bin/bash

#Some formatting variables
red=$(tput setaf 1)
magenta=$(tput setaf 203)
normal=$(tput sgr0)

# Path variables
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


## Usage info
show_help() {
cat << EOF
  Initialize an haretz JSPM module.

  Usage: ${0##*/} [-iht]

    -h          display this help and exit
    -i          Initialize the module (Default behavior)
    -t          Test the boilerplate.
EOF
}

before() {
  # Ask for module name
  echo -e "Hello,\n\nLet's start setting up your module. Hope you don't mind answering a couple of questions.\n"

  read -p "${magenta}Please type your module's name${normal} (it should usually starts with 'htz-'): " -e -i 'htz-' moduleName
  echo ' '
  read -p "${magenta}Please describe what your module does${normal}: " moduleDescription

  moduleSafeName=$(echo "$moduleName" | sed -r "s/\s+/-/g")
  moduleNaturalName=$(echo "$moduleName" | sed -r "s/-+/ /g")
  moduleUppercaseName=$(echo "$moduleNaturalName" | tr '[:lower:]' '[:upper:]')
  moduleCamelCaseName=$(echo "$moduleSafeName" | sed -r 's/-([a-zA-Z])/\U\1/g')

  echo -e "description: $moduleDescription"

  cd $dir
}

after() {
  # Replace template strings
  find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleNaturalName %>/$moduleNaturalName/g"
  find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleSafeName %>/$moduleSafeName/g"
  find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleUppercaseName %>/$moduleUppercaseName/g"
  find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleCamelCaseName %>/$moduleCamelCaseName/g"
  find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleDescription %>/$moduleDescription/g"
}


init() {
  before

  rm -rf .git
  rm -f README.md
  rm -f .gitignore
  rm -f -- "$0"

  echo -e "Copying files..."
  mv boilerplate/{*,.[A-Za-z0-9]*} ..
  rm -rf boilerplate

  after

  echo -e "Renaming project directory..."
  echo -e "moving $dir to $moduleSafeName"
  cd ..
  mv $dir $moduleSafeName
  cd $moduleSafeName

  # Initialize
  npm run init

}

test() {
  before

  if [ -d "$moduleSafeName" ]; then
   rm -rf $moduleSafeName/**/*
  else
    mkdir $moduleSafeName
  fi

  cp boilerplate/{*,.[A-Za-z0-9]*} $moduleSafeName

  cd $moduleSafeName

  after
}


## Execute init when no flags are passed
if [ $# -eq 0 ] ; then
  init
fi

## Process flags
OPTIND=1
while getopts "hit" opt; do
  case $opt in
    t) # test option
      test
      ;;

    h) # show help
      show_help
      exit 0
      ;;

    i) # Initialize module
      init
      ;;

    *)  # Unknown flag
      echo ""
      show_help >&2
      exit 1
      ;;

  esac
done

shift "$((OPTIND-1))"