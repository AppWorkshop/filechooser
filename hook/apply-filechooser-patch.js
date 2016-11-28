#!/usr/bin/env node
// This just loops through all of the java files specified, looking for the package declaration, and
// adds an import my.package.name.R to each of the java files.

module.exports = function(context) {
  var JsDiff = require('jsdiff');
  var patchFile = 'plugins/com.cesidiodibenedetto.filechooser/patch/android-platform-filechooser.patch';
  var androidManifest = 'platforms/android/AndroidManifest.xml';
  var sourceFilesToPatch = [
      "src/com/cesidiodibenedetto/filechooser/FileChooser.java",
      "src/com/ianhanniballake/localstorage/LocalStorageProvider.java",
      "src/com/ipaulpro/afilechooser/FileChooserActivity.java",
      "src/com/ipaulpro/afilechooser/FileListAdapter.java",
      "src/com/ipaulpro/afilechooser/FileListFragment.java",
      "src/com/ipaulpro/afilechooser/FileLoader.java",
      "src/com/ipaulpro/afilechooser/utils/FileUtils.java"
  ];


  var fs = context.requireCordovaModule('fs');
  var path = context.requireCordovaModule('path');
  var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util.js');
  var ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;

  var projectRoot = context.opts.projectRoot;

  var configXml = cordova_util.projectConfig(projectRoot);
  var config = new ConfigParser(configXml);
  var projectName = config.name();
  var packageName = config.android_packageName() || config.packageName();

  var manifestPath = path.join(context.opts.projectRoot, androidManifest);

  var packageDeclarationPattern = new RegExp('^package[^\n]+\n$');
  var newPackageImport = `\n import ${packageName}.R;\n`;

  // loop through all of the .java files
  for(filename in sourceFilesToPatch) {
    if (sourceFilesToPatch.hasOwnProperty(filename)) {
      var javaSourceFilePath = path.join(context.opts.projectRoot, sourceFilesToPatch[filename]);

      var javaSourceFileData = fs.readFileSync(indexHTMLPath, {'encoding': 'utf8'});

      if (packageDeclarationPattern.test(javaSourceFileData)) {
        var newdata = javaSourceFileData.replace(packageDeclarationPattern, newPackageImport);

        fs.writeFileSync(javaSourceFilePath, newdata);

        console.log(`${context.opts.plugin.id}  updating imports for file ${javaSourceFilePath}`);


      } else {
        // no package declaration found.
        // first find the head.
        console.log(`${context.opts.plugin.id}  no package declaration found for file ${javaSourceFilePath}`);
      }
    }
  }
}