const MongoClient = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017/kundryukov_db';
const connection = MongoClient.connect(dbURL);
const usersCollectionName = 'users_names';
const temporaryStorageName = 'temp_data';

// Customized CLI
const CLICommands = require('commander');
CLICommands
  .version('0.1.3')
  .option('-a, --add-names', 'Add Names command - after flag "--add-names" write new names in a space')
  .option('-u, --update-names', 'Update Names command - after flag "--update-names" write oldName:newName oldName:newName etc...')
  .option('-d, --delete-last-names', 'Delete Last Names command - just write "--delete-last-names"')
  .parse(process.argv);

const cliArgs = CLICommands.args;
if ((!cliArgs || cliArgs.length < 1) && !CLICommands.deleteLastNames) {
  console.error(new Error('Invalid arguments'));

} else {
  // "--add-names" command example:
  // Example: "$ node <fileName> --add-names nameOne nameTwo etc..."
  if (CLICommands.addNames) {
    const convertedNames = prepareNamesForSending(cliArgs);
    connection
      // Connect to Database
      .then(connectToCollections)
      // Update temp data & insert new names
      .then(({names, temp}) => {
        updateTempData(temp, convertedNames);
        return names.insertMany(convertedNames);
      })
      // Show details
      .then(result => {
        const documentsAddedCount = result.result.n;
        console.log('%d users added:', documentsAddedCount);
        cliArgs.forEach(name => console.log('-%s', name));
      })
      .catch(console.error);
  }

  // "--update-names" command example:
  // Example: "$ node <fileName> --update-names oldName:newName oldName:newName etc..."
  if (CLICommands.updateNames) {
    const checkedFormatData = cliArgs.filter(checkUpdateFormat);
    const newNames = prepareNamesForSending(
      checkedFormatData.map(queryString => queryString.split(':')[1])
    );

    connection
      // Connect to Database's collections
      .then(connectToCollections)
      // Update temp data & convert query string
      .then(({names, temp}) => {
        updateTempData(temp, newNames);
        return checkedFormatData.map(queryString => {
          const [oldName, newName] = prepareNamesForSending(queryString.split(':'));
          return names.findOneAndUpdate(oldName, newName);
        });
      })
      // Show info
      .then(result => {
        Promise.all(result)
          .then(results => {
            console.log('-'.repeat(10));
            console.log('Users changed:');
            results.forEach(newName => {
              if (!newName.lastErrorObject) {
                console.log('newName: ', newName);
              }
            });
            showAllNames(usersCollectionName);
          })
      })
      .catch(console.error);
  }
}

// "--delete-last-names" command example:
// Example: "$ node <fileName> --delete-last-names"
if (CLICommands.deleteLastNames) {
  connection
    // Connect to Database's collections
    .then(connectToCollections)
    // Prevent temporary storage & Prepare temp's data
    .then(({names, temp}) => {
      const deletableNamesCollection = temp.find().toArray();
      temp.deleteMany();

      deletableNamesCollection
        // Receiving data and deleting
        .then(deletableNamesArray => {
          if (deletableNamesArray.length < 1) {
            return console.log('Nothing to delete');
          }
          const deleteThis = deletableNamesArray.map(doc => {
            const deletableName = {name: doc.name};
            return names.findOneAndDelete(deletableName);
          });

          // Show info after all processes are complited
          Promise.all(deleteThis)
            .then(res => {
              showAllNames(usersCollectionName);
            })
        });
    })
    .catch(error => {
      console.error(error);
    });
}


// Another functions
//// Convert names array to sending format someName => {name: someName}
function prepareNamesForSending(namesArray) {
  if (!Array.isArray(namesArray)) {
    return new Error('Invalid argument');
  }
  return namesArray.map(name => {
    return {'name': name}
  });
}

//// Update special collection of temporary data
function updateTempData(collection, newData) {
  collection.deleteMany();
  collection.insertMany(newData);
}

//// Check string on Updating query format "fromName:toName"
function checkUpdateFormat(string) {
  const updateFormat = /\w+:{1}\w+/i;
  return updateFormat.test(string);
}

//// Show list of names
function showAllNames(collection) {
  const connection = MongoClient.connect(dbURL);
  connection
    .then(db => db.collection(collection))
    .then(collection => collection.find().toArray())
    .then(documents => {
      console.log('-'.repeat(10));
      console.log('Users list:');
      documents.forEach(doc => {
        if (doc.name) {
          console.log(doc.name);
        }
      });
      console.log('-'.repeat(10));
    })
    .catch(console.error);
}

//// Connected to names and temporary data collections
function connectToCollections(db) {
  return {
    temp: db.collection(temporaryStorageName),
    names: db.collection(usersCollectionName)
  };
}