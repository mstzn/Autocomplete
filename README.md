
Autocomplete
============

Bootstrap + JQuery + JQuery UI Autocomplete ( Hashtag | Mention )

============

Requirements:
Bootstrap or JQuery
JQuery UI (with Autocomplete Widget)

============

Usage:

```html
<script src="http://code.jquery.com/jquery-1.10.2.js" type="text/javascript"></script>
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js" type="text/javascript"></script>
<link href="http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css" type="text/css" rel="stylesheet" />
<script src="jquery.bootstrap.autocomplete.js" type="text/javascript"></script>
```

```html
<textarea id="autocomplete_textarea"></textarea>
```

```js
$('#complete_mention').BootstrapComplete({
  requestURL : '', // Request URL
  method : 'POST' // Request Method
  trigger: '@', // Complete Trigger (Char)
  minLength : 2, // Min character count for completion
  cache : true, // Cache requests
});
```


============

Demo: 
http://www.mesutuzun.com/Prj/BootstrapAutocomplete/
