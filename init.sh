#!/bin/bash

#Some formatting variables
red=$(tput setaf 1)
magenta=$(tput setaf 203)
normal=$(tput sgr0)

# Path variables
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Ask for module name
echo -e "Hello,\n\nLet's start setting up your module. Hope you don't mind answering a couple of questions.\n"

read -p "${magenta}Please type your module's name${normal} (it should usually starts with 'htz-'): " -e -i 'htz-' moduleName
echo ' '
read -p "${magenta}Please describe what your module does${normal}: " moduleDescription

moduleSafeName=$(echo "$moduleName" | sed -r "s/\s+/-/g")
moduleNaturalName=$(echo "$moduleName" | sed -r "s/-+/ /g")
moduleUppercaseName=$(echo "$moduleNaturalName" | tr '[:lower:]' '[:upper:]')

# echo -e "\nGood, your module name is "${magenta}$moduleName${normal}"\n"
echo -e "description: $moduleDescription"

echo -e "Removing boilerplate files..."
cd $dir
#rm -rf .git ## skip for testing purposes
rm -f README.md
rm -f .gitignore
rm -f -- "$0"

echo -e "Copying files..."
cd boilerplate
mv * .[A-Za-z0-9]* ..
cd ..
rm -rf boilerplate

# Replace template strings
find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleNaturalName %>/$moduleNaturalName/g"
find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleSafeName %>/$moduleSafeName/g"
find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleUppercaseName %>/$moduleUppercaseName/g"
find ./ -type f -print0 | xargs -0 sed -i "s/<%= moduleDescription %>/$moduleDescription/g"

echo -e "Renaming project directory..."
echo -e "moving $dir to $moduleSafeName"
cd ..
mv $dir $moduleSafeName
cd $moduleSafeName

# Initialize
npm run init
