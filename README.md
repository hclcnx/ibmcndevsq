# IBM Cloud Connections Styling v1.5.1

### Getting started
The default theme of IBM Connections is not entirely in alignment with Sanquin's style guide . Luckily does IBM offer the possibility to deliver custom stylesheets.

### Requirements
 To work on this project, you'll need the following software:
  - SCSS compiler
  - an IDE
  - Stylish (this plugin is used to test the .css files)
  - GreaseMonkey (this plugin is used to test .js files)

### Project Structure

This project is structured in modules. Most modules consists of a json, sass, css and a minified css file.

```
.
|-- activities
|   |-- activities.json
|   |-- activity.scss
|   |-- activity.css
|   |-- activity.css.map
|   |-- activity.min.css
|-- communities
|   |-- communities.json
|   |-- communities.scss
|   |-- communities.css
|   |-- communities.css.map
|   |-- communities.min.css
|-- files
|   |-- files.json
|   |-- files.scss
|   |-- files.css
|   |-- files.css.map
|   |-- files.min.css
.....

```


### Workflow
Once the changes has been pushed to the master branch, one can open a pull request. The changes will become visible when the pull request is merged.


### Style guide coverage status

|Section| Description | Status |
|-------|------------|---------|
| Global| General rules that applies for all sections| :white_check_mark: |
|Communities| Rules that applies only to communities|:x: |
|Profile | The user's profile |:white_check_mark:  |
| Mycontacts | Network & users overview | :white_check_mark: |





