var fs = require('fs'),
    path = require('path'),
    parser = require('xml2json'),
    flatten = require('flatten'),
    filename = path.join(__dirname, process.argv[2]),
    destname = filename.replace(".opml", ".json"),
    seed = 0;

function read(source){
  var typed = {task: "task", note: "tiddler"};
  function drill(node, parent){
    function convert(child){
      var id = seed++;
      var item = {
        id: id,
        $type: typed[child.type] || "task",
        title: child.text,
        child: []
      };
      if (child.tags){
        item.tag = child.tags.split(",");
      }
      if (child.priority){
        item.priority = parseInt(child.priority);
      }
      if (child.due){
        item.due = child.due;
      }
      if (child.dateModified) {
        item.modified = child.dateModified;
      }
      parent.child.push(id);
      var items = drill(child, item);
      items.unshift(item);
      if (!item.child.length) {
        delete item.child;
      }
      return items;
    }
    return node.outline ? (node.outline.length ? node.outline.map(convert) : [convert(node.outline)]) : [];
  }
  var root = {
    id: seed++,
    $type: "task",
    title: source.opml.head.title,
    child: [],
    modified: source.opml.head.dateModified
  };
  return flatten([root, drill(source.opml.body, root)]);
}

fs.readFile(filename, {encoding: 'utf-8'}, function(err, opml){
  if (!err) {
    var json = JSON.stringify(read(JSON.parse(parser.toJson(opml))), null, "\t");
    fs.writeFile(destname, json, function(err) {
      if (err) {
        console.log("Write failed!", err);
      }
    });
  } else {
    console.log("Read failed!", err);
  }
});