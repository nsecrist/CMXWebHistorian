# CMX Web Historian

CMX Web Historian is a Node.js application which accepts notifications from Cisco CMX and records that data to the database. This was created since tag history data is no longer recorded with CMX and Prime.

## Installation

### Prerequisites

1. Node.js (v6.11.2+)

### Instructions

1. Clone this respository
2. Navigate to your clone and run `npm install`
3. Run `npm start` to launch the webserver
4. Navigate to `http://localhost:3000/` to verify that the webserver is running

## Usage

You can manually run the server using `npm start` or you can opt to utilize [node-windows](https://github.com/coreybutler/node-windows)  to run it as a windows service.

Application metrics can be viewed at `http://localhost:3001/appmetrics-dash/`.

## Building as a Windows Service

This project includes the use of [node-windows](https://github.com/coreybutler/node-windows) to package the project up and run it as a service. Once the node-windows service has veen created, changes to the source scripts only require a service restart. Reference the [node-windows](https://github.com/coreybutler/node-windows) documentation for information on how to run the service in Windows.

## Configure the DB Host

You must set the DBHost string in `config\default.json` and point it to the db you create using the `db\jce_test.bak` as a base.

## Setting up CMX

CMX must be configured to send 'Location Notifications' for tags to the `/notification` endpoint so that the data can be recorded.

## Unit Tests

Run `npm test` to execute the unit tests

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

Copyright 2017, Jacobs Technology Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
