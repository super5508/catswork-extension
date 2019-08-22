# catswork-extension

## Setup to run extension 

```
cd catswork-extension
``` 

if you are working on dev, replace all the url with (mainly in config.js file inside extension) 


`'http://localhost:8080/',` for server 

And 

`'http://localhost:8081'` for dashboard 


<strong> Note: </strong> Make sure your server is working on the appropriate addresses 

Then go to 
`manifest.json` file inside the extension folder 

Change the Permission accordingly for the environment (should probably look like this for dev environment) 

```
	"permissions": [
		"activeTab",
		"storage",
		"http://localhost:8080//"
	]
  ```
  
  Then do 
```
npm install 
```

Once npm install is complete, run the following command 

	`npm run watch-build` 
  
  The watch-build programmes, looks for the changes in the `.jsx` file and builds the extension again whenever there are changes in <strong> JSX files </strong> `  onchange '{src,examples}/**/*.jsx' -- npm run buil` 
  
Now go to chrome, extensions and navigate to 

1. Settings 
2. Extensions 
3. Load unpacked (for the first time) or just reload after saving.

This should make the extension working 
