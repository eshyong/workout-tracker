#Workout Tracker

##Installation
Dev start: clone the repo, then start up the virtual machine:

	$ vagrant up && vagrant ssh
	$ cd /vagrant


Then, run the setup scripts:

	$ sudo ./scripts/setup_env.sh
	$ sudo ./scripts/setup_db.sh


Finally, run `npm install`. To start and stop the service you can use `npm start` and `npm stop`.

##TODO
* Write tests
* Deploy it to production
