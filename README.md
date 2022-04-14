# Konolist - A simple list web app

### Netlify deployment status
[![Netlify Status](https://api.netlify.com/api/v1/badges/19cdecd2-08f5-4507-a6e1-126b61977fc2/deploy-status)](https://list.kono.cx/)

### Project home page
[kono.cx](https://www.kono.cx/)

### Project live link
[list.kono.cx](https://list.kono.cx/)

## About
Konolist is a web app that lets you create lists and tasks within those lists.

I created this app after finishing a React.js book titled "Road to React (2021)" as a practice to apply what I have learned from the book. The app heavily borrows from MS Todo's layout and designs, both Windows desktop and Android mobile versions, to speed up my development process. 

Konolist does not depend on any web service and can function offline when installed as an app. All user data on the app lives on the browser's local storage with encryption applied using CryptoJS, which means that the app data will also get deleted when the user clears their browser's cache.

The app is currently feature-complete at this time of writing, and I have no definite plans for future development.

## Features

### General
- Responsive design & layout.
- Small asset usage by design. App uses system font.
- Users can create as many lists and tasks as they want.
- User data is stored on the browser's local storage.
- User data can be cleared from the app's settings page or by clearing their browser cache.
- The app is a proper Progressive Web App (PWA) and thus can be installed if the user's browser supports it.
- The app can be installed from the settings page or manually using the browser's **install app** or **add to home screen** options.
- Once installed, the app can be used even without an internet connection.

### List
- List creation, modification, deletion
- List name
- List icon (single character, can be any or empty)

### Task
- Task creation, modification, deletion
- Task completion
- Task title
- Task note
- Task creation and last updated date.
- Task grouping for incomplete and completed tasks.
