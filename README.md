# fast-xml2js
In-place replacement for xml2js parseString. This is about 20x-30x faster and makes use of the rapidxml C++ library.

### Install
Run ```npm install fast-xml2js```

### Using
Simply replace

```var parseString = require('xml2js').parseString;```

with

```var parseString = require('fast-xml2js').parseString;```

Then call it like so:

```
parseString('<some_xml>', function(err, result) {
    console.log(result);
});
```

