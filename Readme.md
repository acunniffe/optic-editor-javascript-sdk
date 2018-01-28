# Optic Editor SDK
A nice utility for building Optic IDE plugins 

## Usage 
```javascript
npm install optic-editor-sdk
```

Editor Actions:
 * Search -> detect and push an inline search to Optic
 
 ```javascript
import {EditorConnection} from 'optic-editor-sdk'

EditorConnection.actions.search(file, start, end, 'query string')
```

To detect if an inline search has been input use the following utility:
```javascript
import {checkForSearch} from 'optic-editor-sdk'
checkForSearch('line contents', startInLine, endInline)
```
 
 * Push Context -> push the current state of your editor to Optic
 
  ```javascript
 import {EditorConnection} from 'optic-editor-sdk'
 
 EditorConnection.actions.context(file, start, end, 'file contents')
 ```